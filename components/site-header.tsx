import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";
import { Mark } from "./logo";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Mark />
        <nav className="site-nav" aria-label="Primary navigation">
          <Link href="/explore">Explore data</Link>
          <Link href="/provider">For providers</Link>
          <Link href="/consumer">For developers</Link>
          <a href="https://github.com/Colten-Covington/RangeRelay" target="_blank" rel="noreferrer" aria-label="RangeRelay on GitHub">
            <Github size={17} aria-hidden="true" />
          </a>
        </nav>
        <Link className="button button-small button-light" href="/explore">
          Open console <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </header>
  );
}
