import assert from "node:assert/strict";
import { createServer } from "node:http";
import test from "node:test";
import { createApp } from "../src/app.ts";
import { createSignature } from "../src/security.ts";
import type { RuntimeConfig } from "../src/config.ts";

function testConfig(): RuntimeConfig {
  return {
    host: "127.0.0.1",
    port: 0,
    adminToken: "admin",
    ingestKeyId: "key-1",
    ingestSecret: "secret-1",
    channels: new Map([["flight", {
      id: "flight",
      displayName: "Flight",
      provider: "Provider",
      status: "live",
      delaySeconds: 0,
      maxEventsPerSecond: 10,
      retentionSeconds: 60,
      schemaVersion: "1.0.0",
      fields: { altitude: { type: "number", unit: "m", min: 0, max: 2_000_000 } },
    }]]),
  };
}

test("signed ingestion becomes public telemetry", async (context) => {
  const app = createApp(testConfig());
  const server = createServer((request, response) => app.handler(request, response));
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  context.after(() => { app.store.close(); server.close(); });
  const address = server.address();
  assert.ok(address && typeof address === "object");
  const baseUrl = `http://127.0.0.1:${address.port}`;

  const body = JSON.stringify({
    eventId: "event-1",
    observedAt: new Date().toISOString(),
    sequence: 1,
    values: { altitude: 12345 },
  });
  const timestamp = new Date().toISOString();
  const ingest = await fetch(`${baseUrl}/v1/ingest/flight`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-rangerelay-key-id": "key-1",
      "x-rangerelay-timestamp": timestamp,
      "x-rangerelay-signature": createSignature("secret-1", timestamp, body),
    },
    body,
  });
  assert.equal(ingest.status, 202);

  const latest = await fetch(`${baseUrl}/v1/channels/flight/latest`);
  assert.equal(latest.status, 200);
  assert.equal(latest.headers.get("access-control-allow-origin"), "*");
  const payload = await latest.json() as { data: { values: { altitude: number } } };
  assert.equal(payload.data.values.altitude, 12345);

  const duplicateTimestamp = new Date().toISOString();
  const duplicate = await fetch(`${baseUrl}/v1/ingest/flight`, {
    method: "POST",
    headers: {
      "x-rangerelay-key-id": "key-1",
      "x-rangerelay-timestamp": duplicateTimestamp,
      "x-rangerelay-signature": createSignature("secret-1", duplicateTimestamp, body),
    },
    body,
  });
  assert.equal(duplicate.status, 200);

  const regressionBody = JSON.stringify({
    eventId: "event-2",
    observedAt: new Date().toISOString(),
    sequence: 0,
    values: { altitude: 100 },
  });
  const regressionTimestamp = new Date().toISOString();
  const regression = await fetch(`${baseUrl}/v1/ingest/flight`, {
    method: "POST",
    headers: {
      "x-rangerelay-key-id": "key-1",
      "x-rangerelay-timestamp": regressionTimestamp,
      "x-rangerelay-signature": createSignature("secret-1", regressionTimestamp, regressionBody),
    },
    body: regressionBody,
  });
  assert.equal(regression.status, 409);
});
