import { createHmac, timingSafeEqual } from "node:crypto";

export const MAX_CLOCK_SKEW_SECONDS = 30;

export function createSignature(secret: string, timestamp: string, body: string): string {
  return createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex");
}

export function verifySignature(input: {
  secret: string;
  timestamp: string | undefined;
  signature: string | undefined;
  body: string;
  now?: number;
}): { ok: true } | { ok: false; reason: string } {
  if (!input.timestamp || !input.signature) {
    return { ok: false, reason: "Missing signature headers" };
  }

  const timestampMs = Date.parse(input.timestamp);
  if (!Number.isFinite(timestampMs)) {
    return { ok: false, reason: "Invalid signature timestamp" };
  }

  const now = input.now ?? Date.now();
  if (Math.abs(now - timestampMs) > MAX_CLOCK_SKEW_SECONDS * 1000) {
    return { ok: false, reason: "Signature timestamp is outside the accepted window" };
  }

  const expected = Buffer.from(createSignature(input.secret, input.timestamp, input.body), "hex");
  const supplied = Buffer.from(input.signature, "hex");
  if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) {
    return { ok: false, reason: "Invalid signature" };
  }

  return { ok: true };
}
