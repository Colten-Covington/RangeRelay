import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { MissionExplorer } from "@/components/mission-explorer";

export const metadata: Metadata = {
  title: "Mission explorer",
  description: "Explore live and historical public launch telemetry with visible provenance.",
};

export default function ExplorePage() {
  return <AppShell workspace="Public"><MissionExplorer /></AppShell>;
}
