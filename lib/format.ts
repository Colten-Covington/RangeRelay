export function formatMetric(value: number, unit: string): string {
  return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: value < 1000 ? 1 : 0 }).format(value)} ${unit}`;
}

export function provenanceLabel(value: string): string {
  return value.split("-").map((word) => word[0]?.toUpperCase() + word.slice(1)).join(" ");
}
