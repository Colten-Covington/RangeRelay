"use client";

import Link from "next/link";
import { ArrowRight, CalendarClock, Radio, RotateCcw } from "lucide-react";
import { channels } from "@/data/demo";
import { LiveMissionCard } from "./live-mission-card";
import { ProvenanceBadge } from "./provenance-badge";

export function MissionExplorer() {
  return (
    <>
      <div className="page-heading"><div><span className="overline">Public mission data</span><h1>Mission explorer</h1><p>Watch approved launch telemetry with source and delay always visible.</p></div><div className="page-heading-actions"><Link className="button button-dark app-button" href="/consumer">Build with this data <ArrowRight size={15}/></Link></div></div>
      <div className="explorer-grid">
        <LiveMissionCard />
        <aside className="panel mission-context">
          <div className="panel-header"><div><h2>Flight context</h2><p>Provider-authored public information</p></div><Radio size={17}/></div>
          <div className="flight-phase"><span>Current phase</span><strong>Second-stage ascent</strong><p>Public milestone labels are supplied by the provider. RangeRelay does not infer vehicle health.</p></div>
          <div className="timeline-list"><div className="complete"><i/><span><strong>Liftoff</strong><small>T+ 00:00</small></span></div><div className="complete"><i/><span><strong>Max Q</strong><small>T+ 01:14</small></span></div><div className="complete"><i/><span><strong>Stage separation</strong><small>T+ 02:31</small></span></div><div className="current"><i/><span><strong>Second-stage ascent</strong><small>In progress</small></span></div><div><i/><span><strong>Payload deployment</strong><small>Awaiting provider event</small></span></div></div>
          <div className="context-note"><strong>Informational data</strong><span>This demonstration is synthetic and must not be used for navigation, safety, or operational decisions.</span></div>
        </aside>
      </div>
      <section className="mission-directory-section"><div className="directory-heading"><div><span className="overline">Available channels</span><h2>Continue exploring</h2></div><Link className="plain-button" href="/consumer">Open developer directory <ArrowRight size={14}/></Link></div><div className="mission-directory-grid">{channels.map((channel)=><article className="panel mission-directory-card" key={channel.id}><div className="directory-card-top"><span className={`channel-state channel-state-${channel.status}`}/><span>{channel.status === "live" ? <Radio size={14}/> : channel.status === "scheduled" ? <CalendarClock size={14}/> : <RotateCcw size={14}/>} {channel.launchTime}</span></div><h3>{channel.mission}</h3><p>{channel.vehicle} · {channel.provider}</p><div><ProvenanceBadge value={channel.provenance}/><span>{channel.fields} fields · {channel.delaySeconds}s delay</span></div></article>)}</div></section>
    </>
  );
}
