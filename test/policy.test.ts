import assert from "node:assert/strict";
import test from "node:test";
import { validateEnvelope } from "../src/policy.ts";
import type { ChannelConfig } from "../src/types.ts";

const channel: ChannelConfig = {
  id: "test",
  displayName: "Test",
  provider: "Test",
  status: "live",
  delaySeconds: 0,
  maxEventsPerSecond: 10,
  retentionSeconds: 60,
  schemaVersion: "1.0.0",
  fields: {
    altitude: { type: "number", unit: "m", min: -500, max: 2_000_000 },
    stage: { type: "string", maxLength: 20 },
  },
};

const base = {
  eventId: "evt-1",
  observedAt: "2026-09-15T12:00:00.000Z",
  sequence: 1,
};

test("accepts allowlisted values", () => {
  const result = validateEnvelope({ ...base, values: { altitude: 1000, stage: "ascent" } }, channel);
  assert.equal(result.ok, true);
});

test("rejects fields outside the approved schema", () => {
  const result = validateEnvelope({ ...base, values: { altitude: 1000, engine_serial: "abc" } }, channel);
  assert.equal(result.ok, false);
  if (!result.ok) assert.match(result.errors.join(" "), /engine_serial is not in/);
});

test("immutable deny policy wins over a schema mistake", () => {
  const unsafeChannel = { ...channel, fields: { ...channel.fields, guidance_mode: { type: "string" as const } } };
  const result = validateEnvelope({ ...base, values: { guidance_mode: "internal" } }, unsafeChannel);
  assert.equal(result.ok, false);
  if (!result.ok) assert.match(result.errors.join(" "), /immutable deny policy/);
});

test("rejects values outside approved bounds", () => {
  const result = validateEnvelope({ ...base, values: { altitude: 9_000_000 } }, channel);
  assert.equal(result.ok, false);
  if (!result.ok) assert.match(result.errors.join(" "), /approved maximum/);
});
