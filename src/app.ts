import { randomUUID } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";
import { loadConfig, type RuntimeConfig } from "./config.ts";
import { validateEnvelope } from "./policy.ts";
import { verifySignature } from "./security.ts";
import { EventStore } from "./store.ts";
import type { ApiError, ChannelConfig, PublicEvent } from "./types.ts";

const MAX_BODY_BYTES = 64 * 1024;

function sendJson(response: ServerResponse, status: number, value: unknown): void {
  const body = JSON.stringify(value);
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(body),
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
  });
  response.end(body);
}

function sendError(response: ServerResponse, status: number, code: string, message: string, requestId: string, details?: string[]): void {
  const body: ApiError = { error: { code, message, requestId, ...(details ? { details } : {}) } };
  sendJson(response, status, body);
}

async function readBody(request: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request) {
    const buffer = Buffer.from(chunk);
    size += buffer.length;
    if (size > MAX_BODY_BYTES) throw new Error("BODY_TOO_LARGE");
    chunks.push(buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
}

function publicChannel(channel: ChannelConfig) {
  return {
    id: channel.id,
    displayName: channel.displayName,
    provider: channel.provider,
    status: channel.status,
    delaySeconds: channel.delaySeconds,
    schemaVersion: channel.schemaVersion,
    fields: channel.fields,
  };
}

export function createApp(config: RuntimeConfig = loadConfig(), store = new EventStore()) {
  const recentRequests = new Map<string, number[]>();
  const lastAcceptedSequences = new Map<string, number>();

  const handler = async (request: IncomingMessage, response: ServerResponse) => {
    const requestId = randomUUID();
    response.setHeader("x-request-id", requestId);
    const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);
    const parts = url.pathname.split("/").filter(Boolean);

    if (request.method === "GET" && url.pathname.startsWith("/v1/channels")) {
      response.setHeader("access-control-allow-origin", "*");
    }

    if (request.method === "GET" && url.pathname === "/health") {
      return sendJson(response, 200, { status: "ok", service: "rangerelay", time: new Date().toISOString() });
    }

    if (request.method === "GET" && url.pathname === "/v1/channels") {
      return sendJson(response, 200, { data: [...config.channels.values()].map(publicChannel) });
    }

    if (parts[0] === "v1" && parts[1] === "channels" && parts[2]) {
      const channel = config.channels.get(parts[2]);
      if (!channel) return sendError(response, 404, "CHANNEL_NOT_FOUND", "Unknown channel", requestId);

      if (request.method === "GET" && parts.length === 3) {
        return sendJson(response, 200, { data: publicChannel(channel) });
      }
      if (request.method === "GET" && parts[3] === "latest") {
        const event = store.latest(channel.id);
        if (!event) return sendError(response, 404, "NO_DATA", "No released telemetry is available", requestId);
        return sendJson(response, 200, { data: event });
      }
      if (request.method === "GET" && parts[3] === "events") {
        const after = Number(url.searchParams.get("after") ?? -1);
        const limit = Math.min(1000, Math.max(1, Number(url.searchParams.get("limit") ?? 100)));
        return sendJson(response, 200, { data: store.list(channel.id, Number.isFinite(after) ? after : -1, limit) });
      }
      if (request.method === "GET" && parts[3] === "stream") {
        response.writeHead(200, {
          "content-type": "text/event-stream",
          "cache-control": "no-cache, no-transform",
          connection: "keep-alive",
          "x-accel-buffering": "no",
        });
        response.write(`event: ready\ndata: ${JSON.stringify({ channelId: channel.id, schemaVersion: channel.schemaVersion })}\n\n`);
        const unsubscribe = store.subscribe(channel.id, (event) => response.write(`id: ${event.sequence}\nevent: telemetry\ndata: ${JSON.stringify(event)}\n\n`));
        const heartbeat = setInterval(() => response.write(": heartbeat\n\n"), 15_000);
        request.on("close", () => {
          clearInterval(heartbeat);
          unsubscribe();
        });
        return;
      }
    }

    if (request.method === "POST" && parts[0] === "v1" && parts[1] === "ingest" && parts[2]) {
      const channel = config.channels.get(parts[2]);
      if (!channel) return sendError(response, 404, "CHANNEL_NOT_FOUND", "Unknown channel", requestId);
      if (channel.status !== "live") return sendError(response, 423, "CHANNEL_NOT_LIVE", "Channel publication is disabled", requestId);
      if (request.headers["x-rangerelay-key-id"] !== config.ingestKeyId) {
        return sendError(response, 401, "AUTHENTICATION_FAILED", "Unknown ingest key", requestId);
      }

      let body: string;
      try {
        body = await readBody(request);
      } catch {
        return sendError(response, 413, "BODY_TOO_LARGE", "Request body exceeds 64 KiB", requestId);
      }

      const signature = verifySignature({
        secret: config.ingestSecret,
        timestamp: request.headers["x-rangerelay-timestamp"] as string | undefined,
        signature: request.headers["x-rangerelay-signature"] as string | undefined,
        body,
      });
      if (!signature.ok) return sendError(response, 401, "AUTHENTICATION_FAILED", signature.reason, requestId);

      const now = Date.now();
      const windowStart = now - 1000;
      const samples = (recentRequests.get(channel.id) ?? []).filter((sample) => sample > windowStart);
      if (samples.length >= channel.maxEventsPerSecond) {
        response.setHeader("retry-after", "1");
        return sendError(response, 429, "RATE_LIMITED", "Channel event rate exceeded", requestId);
      }
      samples.push(now);
      recentRequests.set(channel.id, samples);

      let parsed: unknown;
      try {
        parsed = JSON.parse(body);
      } catch {
        return sendError(response, 400, "INVALID_JSON", "Body is not valid JSON", requestId);
      }
      const validation = validateEnvelope(parsed, channel);
      if (!validation.ok) return sendError(response, 422, "POLICY_REJECTED", "Telemetry did not match the approved release policy", requestId, validation.errors);

      if (store.has(channel.id, validation.value.eventId)) {
        return sendJson(response, 200, { data: { status: "duplicate", eventId: validation.value.eventId } });
      }
      const lastSequence = lastAcceptedSequences.get(channel.id);
      if (lastSequence !== undefined && validation.value.sequence <= lastSequence) {
        return sendError(response, 409, "SEQUENCE_REGRESSION", "Sequence must increase for each new event", requestId);
      }

      const receivedAt = new Date().toISOString();
      const event: PublicEvent = {
        ...validation.value,
        channelId: channel.id,
        schemaVersion: channel.schemaVersion,
        receivedAt,
        releaseAt: new Date(Date.parse(receivedAt) + channel.delaySeconds * 1000).toISOString(),
      };
      const status = store.append(event, channel.retentionSeconds);
      if (status === "accepted") lastAcceptedSequences.set(channel.id, event.sequence);
      return sendJson(response, status === "duplicate" ? 200 : 202, { data: { status, eventId: event.eventId, releaseAt: event.releaseAt } });
    }

    if (request.method === "POST" && parts[0] === "v1" && parts[1] === "admin" && parts[2] === "channels" && parts[3] && parts[4] === "status") {
      if (request.headers.authorization !== `Bearer ${config.adminToken}`) {
        return sendError(response, 401, "AUTHENTICATION_FAILED", "Invalid admin token", requestId);
      }
      const channel = config.channels.get(parts[3]);
      if (!channel) return sendError(response, 404, "CHANNEL_NOT_FOUND", "Unknown channel", requestId);
      let body: string;
      try { body = await readBody(request); } catch { return sendError(response, 413, "BODY_TOO_LARGE", "Request body exceeds 64 KiB", requestId); }
      let nextStatus: unknown;
      try { nextStatus = (JSON.parse(body) as { status?: unknown }).status; } catch { return sendError(response, 400, "INVALID_JSON", "Body is not valid JSON", requestId); }
      if (!new Set(["off", "armed", "live"]).has(nextStatus as string)) {
        return sendError(response, 422, "INVALID_STATUS", "Status must be off, armed, or live", requestId);
      }
      channel.status = nextStatus as ChannelConfig["status"];
      return sendJson(response, 200, { data: publicChannel(channel) });
    }

    return sendError(response, 404, "NOT_FOUND", "Route not found", requestId);
  };

  return { handler, store, config };
}
