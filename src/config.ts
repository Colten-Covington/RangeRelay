import { readFileSync } from "node:fs";
import type { ChannelConfig } from "./types.ts";

export type RuntimeConfig = {
  host: string;
  port: number;
  adminToken: string;
  ingestKeyId: string;
  ingestSecret: string;
  channels: Map<string, ChannelConfig>;
};

export function loadConfig(env = process.env): RuntimeConfig {
  const configPath = new URL("../config/channels.json", import.meta.url);
  const parsed = JSON.parse(readFileSync(configPath, "utf8")) as { channels: ChannelConfig[] };

  return {
    host: env.HOST ?? "127.0.0.1",
    port: Number(env.PORT ?? 8787),
    adminToken: env.ADMIN_TOKEN ?? "development-admin-token-change-me",
    ingestKeyId: env.INGEST_KEY_ID ?? "demo-provider-key",
    ingestSecret: env.INGEST_SECRET ?? "development-ingest-secret-change-me",
    channels: new Map(parsed.channels.map((channel) => [channel.id, channel])),
  };
}
