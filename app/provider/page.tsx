import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { ProviderConsole } from "@/components/provider-console";

export const metadata: Metadata = {
  title: "Provider console",
  description: "Configure, rehearse, authorize, and stop public telemetry release.",
};

export default function ProviderPage() {
  return <AppShell workspace="Provider"><ProviderConsole /></AppShell>;
}
