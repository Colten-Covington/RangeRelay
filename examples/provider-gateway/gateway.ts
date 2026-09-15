import { createSignature } from "../../src/security.ts";

type InternalTelemetry = {
  met_seconds: number;
  nav_altitude_m: number;
  nav_speed_mps: number;
  downrange_m: number;
  stage_label?: string;
  internal_guidance_mode?: string;
  internal_vehicle_id?: string;
};

// This projection is the trust boundary. Only explicitly selected, derived/public-safe
// values can leave the provider network. Extra input properties are never serialized.
function buildPublicEnvelope(raw: InternalTelemetry, sequence: number) {
  return {
    eventId: `flight-${sequence}`,
    observedAt: new Date().toISOString(),
    sequence,
    values: {
      mission_elapsed_time: raw.met_seconds,
      altitude: Math.round(raw.nav_altitude_m / 100) * 100,
      speed: Math.round(raw.nav_speed_mps / 10) * 10,
      downrange_distance: Math.round(raw.downrange_m / 1000) * 1000,
      ...(raw.stage_label ? { stage: raw.stage_label } : {}),
    },
  };
}

async function publish(raw: InternalTelemetry, sequence: number) {
  const baseUrl = process.env.RANGERELAY_URL ?? "http://127.0.0.1:8787";
  const channelId = process.env.RANGERELAY_CHANNEL ?? "demo-flight";
  const keyId = process.env.INGEST_KEY_ID ?? "demo-provider-key";
  const secret = process.env.INGEST_SECRET ?? "development-ingest-secret-change-me";
  const body = JSON.stringify(buildPublicEnvelope(raw, sequence));
  const timestamp = new Date().toISOString();
  const response = await fetch(`${baseUrl}/v1/ingest/${channelId}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-rangerelay-key-id": keyId,
      "x-rangerelay-timestamp": timestamp,
      "x-rangerelay-signature": createSignature(secret, timestamp, body),
    },
    body,
  });
  if (!response.ok) throw new Error(`Publish failed (${response.status}): ${await response.text()}`);
  console.log(await response.text());
}

const simulatedInternalSample: InternalTelemetry = {
  met_seconds: 83.2,
  nav_altitude_m: 41123.7,
  nav_speed_mps: 1734.2,
  downrange_m: 58291,
  stage_label: "first-stage-ascent",
  internal_guidance_mode: "THIS_MUST_NOT_LEAVE_THE_PROVIDER_NETWORK",
  internal_vehicle_id: "THIS_MUST_NOT_LEAVE_EITHER",
};

await publish(simulatedInternalSample, Date.now());
