export type Scalar = string | number | boolean | null;

export type FieldDefinition = {
  type: "string" | "number" | "boolean";
  unit?: string;
  min?: number;
  max?: number;
  maxLength?: number;
};

export type ChannelStatus = "off" | "armed" | "live";

export type ChannelConfig = {
  id: string;
  displayName: string;
  provider: string;
  status: ChannelStatus;
  delaySeconds: number;
  maxEventsPerSecond: number;
  retentionSeconds: number;
  schemaVersion: string;
  fields: Record<string, FieldDefinition>;
};

export type IncomingEnvelope = {
  eventId: string;
  observedAt: string;
  sequence: number;
  values: Record<string, Scalar>;
};

export type PublicEvent = IncomingEnvelope & {
  channelId: string;
  schemaVersion: string;
  receivedAt: string;
  releaseAt: string;
};

export type ApiError = {
  error: {
    code: string;
    message: string;
    requestId: string;
    details?: string[];
  };
};
