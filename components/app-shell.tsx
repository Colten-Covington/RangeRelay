"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Braces, ChevronDown, Github, LayoutDashboard, RadioTower, Settings, ShieldCheck } from "lucide-react";
import { Mark } from "./logo";

const nav = [
  { href: "/explore", label: "Mission explorer", icon: RadioTower },
  { href: "/provider", label: "Provider console", icon: ShieldCheck },
  { href: "/consumer", label: "Developer workspace", icon: Braces },
];

export function AppShell({ children, workspace }: { children: React.ReactNode; workspace: string }) {
  const pathname = usePathname();

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="app-sidebar-brand"><Mark /></div>
        <nav className="app-nav" aria-label="Product navigation">
          <span className="app-nav-label">Workspace</span>
          {nav.map(({ href, label, icon: Icon }) => (
            <Link className={pathname === href ? "active" : ""} href={href} key={href}>
              <Icon size={17} aria-hidden="true" /> {label}
            </Link>
          ))}
          <span className="app-nav-label app-nav-label-spaced">Resources</span>
          <a href="/openapi.yaml"><LayoutDashboard size={17} aria-hidden="true" /> API reference</a>
          <a href="https://github.com/Colten-Covington/RangeRelay" target="_blank" rel="noreferrer"><Github size={17} aria-hidden="true" /> GitHub</a>
        </nav>
        <div className="app-sidebar-footer">
          <div className="environment-pill"><span /> Pilot environment</div>
          <button className="workspace-switcher" type="button">
            <span className="avatar">RR</span>
            <span><strong>RangeRelay Labs</strong><small>{workspace}</small></span>
            <ChevronDown size={15} aria-hidden="true" />
          </button>
        </div>
      </aside>
      <div className="app-body">
        <header className="app-topbar">
          <div className="mobile-brand"><Mark /></div>
          <div className="app-topbar-status"><span /> All systems nominal</div>
          <button className="icon-button" type="button" aria-label="Settings"><Settings size={18} /></button>
        </header>
        <main className="app-main">{children}</main>
      </div>
    </div>
  );
}
