import Link from "next/link";

export function Mark({ compact = false }: { compact?: boolean }) {
  return (
    <Link className="brand" href="/" aria-label="RangeRelay home">
      <span className="brand-mark" aria-hidden="true">
        <span className="brand-orbit" />
        <span className="brand-core" />
      </span>
      {!compact && <span className="brand-name">RangeRelay</span>}
    </Link>
  );
}
