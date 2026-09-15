import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { ConsumerWorkspace } from "@/components/consumer-workspace";

export const metadata: Metadata = {
  title: "Developer workspace",
  description: "Discover launch telemetry channels, inspect schemas, and build against live events.",
};

export default function ConsumerPage() {
  return <AppShell workspace="Developer"><ConsumerWorkspace /></AppShell>;
}
