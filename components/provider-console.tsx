"use client";

import { useState } from "react";
import { Activity, AlertTriangle, ArrowRight, Check, CheckCircle2, Clock3, Gauge, KeyRound, LockKeyhole, Play, Radio, RotateCw, ShieldCheck, Signal, Square, X } from "lucide-react";
import { auditEvents, manifestFields } from "@/data/demo";

type ReleaseStatus = "off" | "armed" | "live";

function StatusChip({ status }: { status: ReleaseStatus }) {
  return <span className={`status-chip status-${status}`}><span />{status[0].toUpperCase() + status.slice(1)}</span>;
}

export function ProviderConsole() {
  const [status, setStatus] = useState<ReleaseStatus>("armed");
  const [showAuthorize, setShowAuthorize] = useState(false);
  const [dryRun, setDryRun] = useState<"idle" | "running" | "passed">("idle");
  const [tab, setTab] = useState<"overview" | "manifest" | "audit">("overview");
  const [understood, setUnderstood] = useState(false);

  function runDryRun() {
    setDryRun("running");
    window.setTimeout(() => setDryRun("passed"), 950);
  }

  return (
    <>
      <div className="page-heading">
        <div><span className="overline">Provider control room / Atlas Demo 01</span><h1>Release operations</h1><p>Configure, rehearse, authorize, and stop the public flight feed.</p></div>
        <div className="page-heading-actions">
          <button className="button button-light app-button" type="button" onClick={runDryRun} disabled={dryRun === "running"}>
            {dryRun === "running" ? <RotateCw className="spin" size={16} /> : dryRun === "passed" ? <CheckCircle2 size={16} /> : <Play size={16} />}
            {dryRun === "running" ? "Running…" : dryRun === "passed" ? "Dry run passed" : "Run dry test"}
          </button>
          {status !== "live" ? (
            <button className="button button-dark app-button" type="button" disabled={status !== "armed"} onClick={() => setShowAuthorize(true)}>Authorize live <ArrowRight size={16} /></button>
          ) : (
            <button className="button button-danger app-button" type="button" onClick={() => setStatus("off")}><Square size={14} fill="currentColor" /> Stop release</button>
          )}
        </div>
      </div>

      <div className="pilot-notice"><AlertTriangle size={17} /><div><strong>Synthetic pilot environment</strong><span>Controls are interactive, but no provider system or flight hardware is connected.</span></div></div>

      <div className="kpi-grid provider-kpis">
        <div className="panel kpi"><div className="kpi-top"><span>Gateway</span><Signal size={16} /></div><div className="kpi-value kpi-text">Connected</div><div className="kpi-detail">rr-edge-01 · 41 ms</div></div>
        <div className="panel kpi"><div className="kpi-top"><span>Release state</span><ShieldCheck size={16} /></div><div className="kpi-value"><StatusChip status={status} /></div><div className="kpi-detail">Mission window closes in 4h 12m</div></div>
        <div className="panel kpi"><div className="kpi-top"><span>Accepted events</span><Activity size={16} /></div><div className="kpi-value">18,420</div><div className="kpi-detail positive">100.00% passed policy</div></div>
        <div className="panel kpi"><div className="kpi-top"><span>Public delay</span><Clock3 size={16} /></div><div className="kpi-value">15.0 s</div><div className="kpi-detail">Locked by manifest v1.0.0</div></div>
      </div>

      <div className="console-tabs" role="tablist" aria-label="Provider console sections">
        {(["overview", "manifest", "audit"] as const).map((value) => <button aria-selected={tab === value} className={tab === value ? "active" : ""} key={value} onClick={() => setTab(value)} role="tab" type="button">{value === "manifest" ? "Release manifest" : value[0].toUpperCase() + value.slice(1)}</button>)}
      </div>

      {tab === "overview" && <Overview status={status} setStatus={setStatus} openAuthorize={() => setShowAuthorize(true)} openAudit={() => setTab("audit")} dryRun={dryRun} />}
      {tab === "manifest" && <Manifest />}
      {tab === "audit" && <Audit />}

      {showAuthorize && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setShowAuthorize(false)}>
          <section className="authorize-modal" role="dialog" aria-modal="true" aria-labelledby="authorize-title">
            <button className="modal-close" type="button" onClick={() => setShowAuthorize(false)} aria-label="Close"><X size={18} /></button>
            <div className="authorize-icon"><Radio size={22} /></div>
            <span className="overline">Final publication gate</span>
            <h2 id="authorize-title">Authorize public release?</h2>
            <p>Events matching manifest <span className="mono">v1.0.0 · 3d8b…f271</span> will become public after the configured 15-second delay. Public data cannot be recalled once delivered.</p>
            <div className="approval-list">
              <div><Check size={15} /><span><strong>Maya Chen</strong><small>Security &amp; data owner · approved 14:32 UTC</small></span></div>
              <div><Check size={15} /><span><strong>Noah Ellis</strong><small>Mission communications · approved 14:30 UTC</small></span></div>
            </div>
            <label className="authorization-check"><input type="checkbox" checked={understood} onChange={(event) => setUnderstood(event.target.checked)} /> <span>I understand that stopping the feed cannot retract events already received by consumers.</span></label>
            <div className="modal-actions"><button className="button button-light app-button" type="button" onClick={() => setShowAuthorize(false)}>Cancel</button><button className="button button-primary app-button" type="button" disabled={!understood} onClick={() => { setStatus("live"); setShowAuthorize(false); setUnderstood(false); }}>Authorize release</button></div>
          </section>
        </div>
      )}
    </>
  );
}

function Overview({ status, setStatus, openAuthorize, openAudit, dryRun }: { status: ReleaseStatus; setStatus: (status: ReleaseStatus) => void; openAuthorize: () => void; openAudit: () => void; dryRun: string }) {
  return (
    <div className="provider-grid">
      <section className="panel release-panel">
        <div className="panel-header"><div><h2>Release path</h2><p>Independent checks from provider source to public edge</p></div><StatusChip status={status} /></div>
        <div className="release-path">
          <div className="release-node complete"><span><Check size={15} /></span><div><strong>Approved source</strong><small>Read-only adapter · healthy</small></div></div>
          <div className="release-connector"><i /><small>local</small></div>
          <div className="release-node complete"><span><Check size={15} /></span><div><strong>Release gateway</strong><small>Projection loaded · signed build</small></div></div>
          <div className="release-connector"><i /><small>mTLS</small></div>
          <div className="release-node complete"><span><Check size={15} /></span><div><strong>Policy edge</strong><small>Manifest hash matched</small></div></div>
          <div className="release-connector"><i /><small>15 s</small></div>
          <div className={`release-node ${status === "live" ? "live" : status === "armed" ? "ready" : ""}`}><span>{status === "live" ? <Radio size={15} /> : <LockKeyhole size={15} />}</span><div><strong>Public API</strong><small>{status === "live" ? "Publishing approved fields" : status === "armed" ? "Awaiting final authorization" : "Publication stopped"}</small></div></div>
        </div>
        <div className="release-health-chart" aria-label="Gateway event rate over the last five minutes"><div className="chart-bars">{[42,50,46,56,54,59,61,57,63,67,64,70,68,73,69,75,78,76,81,79,83,85,82,87,84,89,91,88,92,90].map((height,index)=><i key={index} style={{height:`${height}%`}} />)}</div><div><span>Gateway throughput</span><strong>9.8 events/s</strong></div></div>
      </section>

      <aside className="panel safety-panel">
        <div className="panel-header"><div><h2>Publication control</h2><p>One person can always stop</p></div><ShieldCheck size={18} /></div>
        <div className="panel-body">
          <div className="release-state"><StatusChip status={status} /><h3>{status === "live" ? "Public release is live" : status === "armed" ? "Ready for final authorization" : "Public release is stopped"}</h3><p>{status === "live" ? "Approved events are leaving the delay queue and reaching public consumers." : status === "armed" ? "Both reviewers approved this immutable manifest. No events are public yet." : "New ingestion and public release are disabled for this channel."}</p></div>
          <div className="control-facts"><div><span>Manifest</span><strong>v1.0.0 · 3d8b…f271</strong></div><div><span>Approvals</span><strong>2 of 2 complete</strong></div><div><span>Automatic stop</span><strong>18:45 UTC</strong></div><div><span>Last dry run</span><strong>{dryRun === "passed" ? "Just now · passed" : "14:28 UTC · passed"}</strong></div></div>
          {status === "live" ? <button className="stop-control" type="button" onClick={() => setStatus("off")}><Square size={17} fill="currentColor" /><span><strong>Stop public release</strong><small>Immediate · does not retract prior events</small></span></button> : status === "armed" ? <button className="button button-dark full-button" type="button" onClick={openAuthorize}>Review and authorize <ArrowRight size={16} /></button> : <button className="button button-light full-button" type="button" onClick={() => setStatus("armed")}><ShieldCheck size={16} /> Arm after review</button>}
        </div>
      </aside>

      <section className="panel activity-panel">
        <div className="panel-header"><div><h2>Recent operations</h2><p>Security-relevant actions and gateway activity</p></div><button className="plain-button" type="button" onClick={openAudit}>View audit log <ArrowRight size={14} /></button></div>
        <div className="activity-list">
          {auditEvents.slice(0,3).map((event, index) => <div key={event.time}><span className={`activity-icon activity-${index}`}><Check size={14} /></span><p><strong>{event.action}</strong><small>{event.actor} · {event.detail}</small></p><time>{event.time}</time></div>)}
        </div>
      </section>

      <section className="panel credential-panel">
        <div className="panel-header"><div><h2>Mission credential</h2><p>Environment-scoped publishing identity</p></div><KeyRound size={18} /></div>
        <div className="panel-body"><div className="credential-value"><span className="mono">rr_live_••••••••7ac2</span><StatusChip status="live" /></div><div className="credential-meta"><span>Rotated 12m ago</span><span>Expires at mission close</span></div><button className="button button-light full-button" type="button" disabled title="Credential rotation requires the production key service"><RotateCw size={15} /> Rotation available after KMS setup</button></div>
      </section>
    </div>
  );
}

function Manifest() {
  return <section className="panel manifest-panel"><div className="panel-header"><div><h2>Approved public schema</h2><p>Immutable while this channel is armed or live · SHA-256 3d8b…f271</p></div><span className="status-chip status-live"><Check size={13} />Two approvals</span></div><div className="manifest-summary"><div><span>Schema version</span><strong>1.0.0</strong></div><div><span>Fields approved</span><strong>6</strong></div><div><span>Maximum rate</span><strong>10 Hz</strong></div><div><span>Release delay</span><strong>15 seconds</strong></div></div><div className="table-scroll"><table className="data-table"><thead><tr><th>Public field</th><th>Meaning</th><th>Type</th><th>Unit</th><th>Precision</th><th>Status</th></tr></thead><tbody>{manifestFields.map((field)=><tr key={field.name}><td className="mono">{field.name}</td><td>{field.label}</td><td>{field.type}</td><td>{field.unit}</td><td>{field.precision}</td><td><span className="table-approved"><Check size={13} />Approved</span></td></tr>)}</tbody></table></div><div className="manifest-rule"><LockKeyhole size={17}/><p><strong>Projection-only release</strong><span>Unknown fields, dynamic names, raw packets, commands, guidance, termination, security, and key material fail closed.</span></p></div></section>;
}

function Audit() {
  return <section className="panel audit-panel"><div className="panel-header"><div><h2>Audit timeline</h2><p>Append-only security and release decisions</p></div><button className="button button-light app-button" type="button">Export signed log</button></div><div className="audit-timeline">{auditEvents.map((event)=><div key={event.time}><time className="mono">{event.time}</time><span className="audit-dot"/><p><strong>{event.action}</strong><small>{event.actor} · {event.detail}</small></p></div>)}</div></section>;
}
