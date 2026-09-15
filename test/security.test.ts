import assert from "node:assert/strict";
import test from "node:test";
import { createSignature, verifySignature } from "../src/security.ts";

test("accepts a valid current signature", () => {
  const timestamp = "2026-09-15T12:00:00.000Z";
  const body = '{"safe":true}';
  const secret = "test-secret";
  assert.deepEqual(verifySignature({
    secret,
    timestamp,
    body,
    signature: createSignature(secret, timestamp, body),
    now: Date.parse(timestamp),
  }), { ok: true });
});

test("rejects an expired signature", () => {
  const timestamp = "2026-09-15T12:00:00.000Z";
  const body = "{}";
  const secret = "test-secret";
  const result = verifySignature({
    secret,
    timestamp,
    body,
    signature: createSignature(secret, timestamp, body),
    now: Date.parse(timestamp) + 31_000,
  });
  assert.equal(result.ok, false);
});

test("rejects a modified body", () => {
  const timestamp = "2026-09-15T12:00:00.000Z";
  const secret = "test-secret";
  const result = verifySignature({
    secret,
    timestamp,
    body: '{"safe":false}',
    signature: createSignature(secret, timestamp, '{"safe":true}'),
    now: Date.parse(timestamp),
  });
  assert.equal(result.ok, false);
});
