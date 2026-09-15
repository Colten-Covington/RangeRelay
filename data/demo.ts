export type ChannelProvenance = "provider-certified" | "provider-authorized" | "community-derived";

export type ChannelSummary = {
  id: string;
  mission: string;
  vehicle: string;
  provider: string;
  provenance: ChannelProvenance;
  status: "live" | "scheduled" | "replay";
  launchTime: string;
  fields: number;
  delaySeconds: number;
};

export const channels: ChannelSummary[] = [
  {
    id: "atlas-demo-01",
    mission: "Atlas Demo 01",
    vehicle: "RR-1 Pathfinder",
    provider: "RangeRelay Labs",
    provenance: "provider-certified",
    status: "live",
    launchTime: "Live now",
    fields: 6,
    delaySeconds: 15,
  },
  {
    id: "horizon-test-7",
    mission: "Horizon Test 7",
    vehicle: "Sparrow II",
    provider: "Northstar Research",
    provenance: "provider-authorized",
    status: "scheduled",
    launchTime: "Sep 19 · 14:30 UTC",
    fields: 8,
    delaySeconds: 30,
  },
  {
    id: "archive-flight-24",
    mission: "Archive Flight 24",
    vehicle: "Terrapin",
    provider: "Community archive",
    provenance: "community-derived",
    status: "replay",
    launchTime: "Recorded Jul 08",
    fields: 5,
    delaySeconds: 0,
  },
];

export const manifestFields = [
  { name: "mission_elapsed_time", label: "Mission elapsed time", type: "number", unit: "s", precision: "0.1", status: "approved" },
  { name: "altitude", label: "Rounded altitude", type: "number", unit: "m", precision: "100", status: "approved" },
  { name: "speed", label: "Rounded velocity", type: "number", unit: "m/s", precision: "10", status: "approved" },
  { name: "downrange_distance", label: "Downrange distance", type: "number", unit: "m", precision: "1,000", status: "approved" },
  { name: "stage", label: "Public flight phase", type: "string", unit: "—", precision: "—", status: "approved" },
  { name: "event", label: "Public milestone", type: "string", unit: "—", precision: "—", status: "approved" },
] as const;

export const auditEvents = [
  { time: "14:32:08", actor: "Maya Chen", action: "Approved release manifest", detail: "sha256:3d8b…f271" },
  { time: "14:30:41", actor: "Noah Ellis", action: "Approved release manifest", detail: "Second authorization" },
  { time: "14:28:19", actor: "Gateway rr-edge-01", action: "Dry run completed", detail: "18,420 events · 0 rejected" },
  { time: "14:20:03", actor: "Maya Chen", action: "Rotated mission credential", detail: "key rr_live_••7ac2" },
] as const;

export const telemetrySeed = {
  missionElapsedTime: 164.2,
  altitude: 121_400,
  speed: 4_820,
  downrange: 287_000,
  stage: "Second-stage ascent",
  eventCount: 1_642,
};
