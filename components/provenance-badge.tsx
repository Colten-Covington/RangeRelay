import { BadgeCheck, Radio, UsersRound } from "lucide-react";
import type { ChannelProvenance } from "@/data/demo";
import { provenanceLabel } from "@/lib/format";

const icons = {
  "provider-certified": BadgeCheck,
  "provider-authorized": Radio,
  "community-derived": UsersRound,
};

export function ProvenanceBadge({ value, compact = false }: { value: ChannelProvenance; compact?: boolean }) {
  const Icon = icons[value];
  return (
    <span className={`provenance provenance-${value}`} title={provenanceLabel(value)}>
      <Icon size={14} aria-hidden="true" />
      {!compact && provenanceLabel(value)}
    </span>
  );
}
