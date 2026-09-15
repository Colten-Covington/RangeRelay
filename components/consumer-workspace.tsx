"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, Check, ChevronDown, Clock3, Copy, ExternalLink, Gauge, KeyRound, Pause, Play, Search, Signal, TerminalSquare, X } from "lucide-react";
import { channels, telemetrySeed } from "@/data/demo";
import { ProvenanceBadge } from "./provenance-badge";

const apiBaseUrl = process.env.NEXT_PUBLIC_RANGERELAY_API_URL ?? "http://127.0.0.1:8787";

const snippets = {
  typescript: `const stream = new EventSource(
  "${apiBaseUrl}/v1/channels/atlas-demo-01/stream"
);

stream.addEventListener("telemetry", ({ data }) => {
  const event = JSON.parse(data);
  updateGraphics(event.values);
});`,
  curl: `curl -N \\
  ${apiBaseUrl}/v1/channels/atlas-demo-01/stream`,
  response: `{
  "eventId": "flight-00001642",
  "channelId": "atlas-demo-01",
  "schemaVersion": "1.0.0",
  "sequence": 1642,
  "values": {
    "altitude": 121400,
    "speed": 4820,
    "stage": "second-stage-ascent"
  }
}`,
};

export function ConsumerWorkspace() {
  const [channelId, setChannelId] = useState(channels[0].id);
  const [running, setRunning] = useState(true);
  const [tick, setTick] = useState(0);
  const [codeTab, setCodeTab] = useState<keyof typeof snippets>("typescript");
  const [copied, setCopied] = useState(false);
  const [query, setQuery] = useState("");
  const [showKey, setShowKey] = useState(false);
  const channel = channels.find((item) => item.id === channelId) ?? channels[0];
  const filteredChannels = channels.filter((item) => `${item.mission} ${item.vehicle} ${item.provider}`.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    if (!running || channel.status !== "live") return;
    const timer = window.setInterval(() => setTick((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [running, channel.status]);

  const events = useMemo(() => Array.from({ length: 7 }, (_, index) => ({
    sequence: telemetrySeed.eventCount + tick - index,
    met: telemetrySeed.missionElapsedTime + tick - index,
    altitude: telemetrySeed.altitude + (tick - index) * 1_270,
    speed: telemetrySeed.speed + (tick - index) * 18,
    stage: index < 5 ? "second-stage-ascent" : "stage-separation",
  })), [tick]);

  async function copySnippet() {
    await navigator.clipboard.writeText(snippets[codeTab]);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <>
      <div className="page-heading">
        <div><span className="overline">Consumer tools / Public API</span><h1>Developer workspace</h1><p>Discover a channel, inspect its contract, and see events arrive.</p></div>
        <div className="page-heading-actions"><a className="button button-light app-button" href="/openapi.yaml">API reference <ExternalLink size={15} /></a><button className="button button-dark app-button" type="button" onClick={() => setShowKey(true)}><TerminalSquare size={15} /> Create API key</button></div>
      </div>

      <div className="consumer-workspace-grid">
        <aside className="panel channel-browser">
          <div className="panel-header"><div><h2>Channel directory</h2><p>{channels.length} pilot channels</p></div></div>
          <label className="channel-search"><Search size={15} /><input aria-label="Search channels" placeholder="Search missions" value={query} onChange={(event)=>setQuery(event.target.value)} /></label>
          <div className="channel-list">
            {filteredChannels.map((item) => <button className={item.id === channelId ? "active" : ""} type="button" key={item.id} onClick={() => { setChannelId(item.id); setTick(0); }}>
              <span className={`channel-state channel-state-${item.status}`} />
              <span className="channel-copy"><strong>{item.mission}</strong><small>{item.vehicle} · {item.provider}</small><ProvenanceBadge value={item.provenance} /></span>
              <ChevronDown className="channel-chevron" size={15} />
            </button>)}
            {filteredChannels.length === 0 && <div className="channel-empty">No pilot channels match “{query}”.</div>}
          </div>
          <div className="channel-browser-footer"><span>Can’t find a mission?</span><a href="https://github.com/Colten-Covington/RangeRelay/issues">Request a public adapter</a></div>
        </aside>

        <div className="consumer-workspace-main">
          <section className="panel channel-detail">
            <div className="channel-detail-top">
              <div><div className="detail-title-line"><span className={`channel-state channel-state-${channel.status}`} /><h2>{channel.mission}</h2><span className={`status-chip status-${channel.status === "live" ? "live" : "off"}`}>{channel.status}</span></div><p>{channel.vehicle} · {channel.provider}</p></div>
              <ProvenanceBadge value={channel.provenance} />
            </div>
            <div className="endpoint-row"><span className="mono">GET /v1/channels/{channel.id}/stream</span><button type="button" onClick={() => navigator.clipboard.writeText(`${apiBaseUrl}/v1/channels/${channel.id}/stream`)} aria-label="Copy endpoint"><Copy size={15} /></button></div>
            <div className="channel-meta"><div><span>Schema</span><strong>v1.0.0</strong></div><div><span>Fields</span><strong>{channel.fields}</strong></div><div><span>Provider delay</span><strong>{channel.delaySeconds} s</strong></div><div><span>Transport</span><strong>SSE + REST</strong></div></div>
          </section>

          <div className="consumer-kpi-grid">
            <div className="panel mini-kpi"><span><Clock3 size={15}/> Mission time</span><strong className="mono">T+ {(telemetrySeed.missionElapsedTime + tick).toFixed(1)} s</strong></div>
            <div className="panel mini-kpi"><span><Activity size={15}/> Altitude</span><strong className="mono">{((telemetrySeed.altitude + tick * 1_270) / 1000).toFixed(1)} km</strong></div>
            <div className="panel mini-kpi"><span><Gauge size={15}/> Velocity</span><strong className="mono">{(telemetrySeed.speed + tick * 18).toLocaleString()} m/s</strong></div>
          </div>

          <section className="panel event-stream-panel">
            <div className="panel-header"><div><h2>Event stream</h2><p>Informational pilot data · not for safety-critical use</p></div><div className="stream-controls"><span className="stream-health"><Signal size={14}/> {channel.status === "live" ? "Receiving · 10 Hz" : "No live publisher"}</span><button className="icon-button" type="button" disabled={channel.status !== "live"} onClick={() => setRunning((value) => !value)} aria-label={running ? "Pause event stream" : "Resume event stream"}>{running ? <Pause size={15}/> : <Play size={15}/>}</button></div></div>
            <div className="table-scroll"><table className="data-table event-table"><thead><tr><th>Sequence</th><th>MET</th><th>Altitude</th><th>Velocity</th><th>Public phase</th><th>Quality</th></tr></thead><tbody>{events.map((event, index)=><tr className={index === 0 && running ? "event-new" : ""} key={event.sequence}><td className="mono">{event.sequence}</td><td className="mono">{event.met.toFixed(1)} s</td><td className="mono">{Math.max(0,event.altitude).toLocaleString()} m</td><td className="mono">{Math.max(0,event.speed).toLocaleString()} m/s</td><td>{event.stage}</td><td><span className="quality-good"><Check size={12}/> good</span></td></tr>)}</tbody></table></div>
          </section>

          <section className="panel quickstart-panel">
            <div className="panel-header"><div><h2>Quick start</h2><p>No API key required for public pilot channels</p></div></div>
            <div className="code-tabs">{(Object.keys(snippets) as Array<keyof typeof snippets>).map((value)=><button className={codeTab === value ? "active" : ""} type="button" key={value} onClick={()=>setCodeTab(value)}>{value === "typescript" ? "TypeScript" : value === "curl" ? "cURL" : "Example response"}</button>)}<button className="copy-code" type="button" onClick={copySnippet}>{copied ? <Check size={14}/> : <Copy size={14}/>} {copied ? "Copied" : "Copy"}</button></div>
            <pre><code>{snippets[codeTab]}</code></pre>
          </section>
        </div>
      </div>
      {showKey && <div className="modal-backdrop" role="presentation" onMouseDown={(event)=>event.target===event.currentTarget && setShowKey(false)}><section className="authorize-modal key-modal" role="dialog" aria-modal="true" aria-labelledby="key-title"><button className="modal-close" type="button" onClick={()=>setShowKey(false)} aria-label="Close"><X size={18}/></button><div className="authorize-icon"><KeyRound size={21}/></div><span className="overline">Pilot credential</span><h2 id="key-title">Your test API key</h2><p>This temporary key demonstrates the credential UX. It is held only in this browser and does not grant production access.</p><div className="generated-key"><code>rr_test_demo_7ac2f19e</code><button type="button" onClick={()=>navigator.clipboard.writeText("rr_test_demo_7ac2f19e")} aria-label="Copy test API key"><Copy size={15}/></button></div><div className="key-scope"><span><Check size={14}/> Read public channels</span><span><Check size={14}/> 60 requests/minute</span><span><X size={14}/> No provider ingestion</span></div><div className="modal-actions"><button className="button button-dark app-button" type="button" onClick={()=>setShowKey(false)}>Done</button></div></section></div>}
    </>
  );
}
