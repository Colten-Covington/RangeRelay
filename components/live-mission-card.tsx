"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, Clock3, Pause, Play, Radio } from "lucide-react";
import { telemetrySeed } from "@/data/demo";
import { formatMetric } from "@/lib/format";
import { ProvenanceBadge } from "./provenance-badge";

export function LiveMissionCard({ compact = false }: { compact?: boolean }) {
  const [running, setRunning] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setTick((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  const telemetry = useMemo(() => ({
    met: telemetrySeed.missionElapsedTime + tick,
    altitude: telemetrySeed.altitude + tick * 1_270,
    speed: telemetrySeed.speed + tick * 18,
    downrange: telemetrySeed.downrange + tick * 2_450,
  }), [tick]);

  const points = useMemo(() => Array.from({ length: 28 }, (_, index) => {
    const x = (index / 27) * 100;
    const curve = 83 - Math.pow(index / 27, 0.7) * 59;
    const wave = Math.sin(index * 0.8 + tick * 0.12) * 1.2;
    return `${x},${curve + wave}`;
  }).join(" "), [tick]);

  return (
    <section className={`mission-card ${compact ? "mission-card-compact" : ""}`} aria-label="Live demonstration telemetry">
      <div className="mission-card-header">
        <div>
          <span className="eyebrow"><span className="live-dot" /> Live demonstration</span>
          <h2>Atlas Demo 01</h2>
          <p>RR-1 Pathfinder · Second-stage ascent</p>
        </div>
        <button className="icon-button icon-button-dark" type="button" onClick={() => setRunning((value) => !value)} aria-label={running ? "Pause demo telemetry" : "Resume demo telemetry"}>
          {running ? <Pause size={17} /> : <Play size={17} />}
        </button>
      </div>

      <div className="mission-chart">
        <div className="chart-grid" aria-hidden="true" />
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="Altitude increasing over mission time">
          <defs>
            <linearGradient id="mission-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#7cf2c6" stopOpacity=".28" />
              <stop offset="1" stopColor="#7cf2c6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={`0,100 ${points} 100,100`} fill="url(#mission-fill)" />
          <polyline points={points} fill="none" stroke="#8af4cd" strokeWidth="1.3" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="chart-label chart-label-top">121 km</div>
        <div className="chart-label chart-label-bottom">T+00:02:44</div>
      </div>

      <div className="mission-metrics">
        <div><span><Clock3 size={14} /> Mission time</span><strong>T+ {telemetry.met.toFixed(1)} s</strong></div>
        <div><span><Activity size={14} /> Altitude</span><strong>{formatMetric(telemetry.altitude / 1000, "km")}</strong></div>
        <div><span><Radio size={14} /> Velocity</span><strong>{formatMetric(telemetry.speed, "m/s")}</strong></div>
      </div>

      <div className="mission-card-footer">
        <ProvenanceBadge value="provider-certified" />
        <span>15 s provider delay</span>
        <span>Sequence {(telemetrySeed.eventCount + tick).toLocaleString()}</span>
      </div>
    </section>
  );
}
