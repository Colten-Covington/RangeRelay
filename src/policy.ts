import type { ChannelConfig, IncomingEnvelope, Scalar } from "./types.ts";

const FORBIDDEN_FIELD_FRAGMENTS = [
  "command",
  "guidance",
  "encryption",
  "secret",
  "token",
  "key",
  "target",
  "warhead",
  "range_safety",
  "flight_termination",
];

export function validateEnvelope(
  input: unknown,
  channel: ChannelConfig,
): { ok: true; value: IncomingEnvelope } | { ok: false; errors: string[] } {
  const errors: string[] = [];
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, errors: ["Body must be a JSON object"] };
  }

  const candidate = input as Record<string, unknown>;
  if (typeof candidate.eventId !== "string" || !/^[A-Za-z0-9._:-]{1,128}$/.test(candidate.eventId)) {
    errors.push("eventId must be 1-128 safe characters");
  }
  if (typeof candidate.observedAt !== "string" || !Number.isFinite(Date.parse(candidate.observedAt))) {
    errors.push("observedAt must be an ISO-8601 timestamp");
  }
  if (!Number.isSafeInteger(candidate.sequence) || Number(candidate.sequence) < 0) {
    errors.push("sequence must be a non-negative safe integer");
  }
  if (!candidate.values || typeof candidate.values !== "object" || Array.isArray(candidate.values)) {
    errors.push("values must be an object");
    return { ok: false, errors };
  }

  const values = candidate.values as Record<string, unknown>;
  if (Object.keys(values).length === 0) errors.push("values must contain at least one field");
  if (Object.keys(values).length > 64) errors.push("values may contain at most 64 fields");

  for (const [name, rawValue] of Object.entries(values)) {
    const normalizedName = name.toLowerCase();
    if (FORBIDDEN_FIELD_FRAGMENTS.some((fragment) => normalizedName.includes(fragment))) {
      errors.push(`${name} is blocked by the immutable deny policy`);
      continue;
    }

    const definition = channel.fields[name];
    if (!definition) {
      errors.push(`${name} is not in the approved channel schema`);
      continue;
    }

    if (rawValue === null || typeof rawValue !== definition.type) {
      errors.push(`${name} must be a ${definition.type}`);
      continue;
    }
    if (definition.type === "number") {
      const number = rawValue as number;
      if (!Number.isFinite(number)) errors.push(`${name} must be finite`);
      if (definition.min !== undefined && number < definition.min) errors.push(`${name} is below its approved minimum`);
      if (definition.max !== undefined && number > definition.max) errors.push(`${name} is above its approved maximum`);
    }
    if (definition.type === "string" && definition.maxLength !== undefined) {
      if ((rawValue as string).length > definition.maxLength) errors.push(`${name} exceeds its maximum length`);
    }
  }

  if (errors.length > 0) return { ok: false, errors };
  return {
    ok: true,
    value: {
      eventId: candidate.eventId as string,
      observedAt: candidate.observedAt as string,
      sequence: candidate.sequence as number,
      values: values as Record<string, Scalar>,
    },
  };
}
