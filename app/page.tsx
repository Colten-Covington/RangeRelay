import Link from "next/link";
import { ArrowRight, BadgeCheck, Braces, Check, Clock3, DatabaseZap, Github, RadioTower, ShieldCheck } from "lucide-react";
import { LiveMissionCard } from "@/components/live-mission-card";
import { SiteHeader } from "@/components/site-header";

const consumers = ["Broadcast graphics", "Livestream overlays", "Mission-control apps", "Education and accessibility"];
const apiBaseUrl = process.env.NEXT_PUBLIC_RANGERELAY_API_URL ?? "http://127.0.0.1:8787";

export default function HomePage() {
  return (
    <div className="marketing-shell">
      <SiteHeader />
      <main>
        <section className="hero section-wrap">
          <div className="hero-copy">
            <div className="hero-kicker"><RadioTower size={15} /> Open infrastructure for public flight data</div>
            <h1>One controlled release.<br /><span>Every public experience.</span></h1>
            <p className="hero-lede">RangeRelay gives launch providers a safe last hop for public telemetry—and gives every streamer, newsroom, classroom, and app one stable API.</p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/explore">Explore live data <ArrowRight size={17} /></Link>
              <Link className="button button-ghost" href="/provider">See the provider workflow</Link>
            </div>
            <div className="hero-proof">
              <span><ShieldCheck size={15} /> Provider-controlled</span>
              <span><BadgeCheck size={15} /> Provenance on every event</span>
              <span><Github size={15} /> Open-source gateway</span>
            </div>
          </div>
          <div className="hero-console-wrap">
            <div className="signal-rings" aria-hidden="true"><i /><i /><i /></div>
            <LiveMissionCard compact />
          </div>
        </section>

        <section className="trust-strip">
          <div className="section-wrap trust-strip-inner">
            <span>The boundary is the product</span>
            <p>RangeRelay never needs raw vehicle telemetry. A provider-side gateway constructs a new public payload from specifically approved fields.</p>
          </div>
        </section>

        <section className="section-wrap split-section" id="providers">
          <div className="section-intro">
            <span className="section-number">01 / Providers</span>
            <h2>Make public release the safest path.</h2>
            <p>Publish the small set of values you already choose to show—without exposing operational systems, building one-off integrations, or surrendering control.</p>
            <Link className="text-link" href="/provider">Open provider console <ArrowRight size={16} /></Link>
          </div>
          <div className="feature-stack">
            <article>
              <div className="feature-icon"><ShieldCheck size={20} /></div>
              <div><h3>Project, don’t redact</h3><p>The gateway constructs output field by field. Unknown data fails closed before it crosses your boundary.</p></div>
            </article>
            <article>
              <div className="feature-icon"><Clock3 size={20} /></div>
              <div><h3>Control the release</h3><p>Set rate, precision, delay, and mission windows. Two people enable publication; one can always stop it.</p></div>
            </article>
            <article>
              <div className="feature-icon"><DatabaseZap size={20} /></div>
              <div><h3>Integrate once</h3><p>RangeRelay handles downstream formats, viewer scale, replay, SDKs, and consumer support.</p></div>
            </article>
          </div>
        </section>

        <section className="consumer-band" id="consumers">
          <div className="section-wrap consumer-layout">
            <div className="consumer-code">
              <div className="code-window-bar"><span /><span /><span /><small>subscribe.ts</small></div>
              <pre><code><span className="code-purple">const</span> stream = <span className="code-purple">new</span> EventSource(<br />  <span className="code-green">&quot;{apiBaseUrl}/v1/&quot;</span> +<br />  <span className="code-green">&quot;channels/atlas-demo-01/stream&quot;</span><br />);<br /><br />stream.addEventListener(<span className="code-green">&quot;telemetry&quot;</span>, event ={">"} &#123;<br />  render(JSON.parse(event.data));<br />&#125;);</code></pre>
            </div>
            <div className="consumer-copy">
              <span className="section-number">02 / Consumers</span>
              <h2>Build the experience.<br />Not another scraper.</h2>
              <p>Discover channels, verify provenance, catch up by sequence, and subscribe live with a contract that stays consistent across missions.</p>
              <ul>{consumers.map((consumer) => <li key={consumer}><Check size={16} /> {consumer}</li>)}</ul>
              <Link className="button button-light" href="/consumer"><Braces size={17} /> Open developer workspace</Link>
            </div>
          </div>
        </section>

        <section className="section-wrap provenance-section">
          <div className="section-intro provenance-heading">
            <span className="section-number">03 / Trust</span>
            <h2>Source is part of the data.</h2>
            <p>Every channel and event carries provenance. Official, authorized, and community-derived feeds can coexist without becoming indistinguishable.</p>
          </div>
          <div className="provenance-grid">
            <article className="provenance-card certified"><span>01</span><BadgeCheck size={24} /><h3>Provider certified</h3><p>Operated and signed by the launch provider through an approved release manifest.</p></article>
            <article className="provenance-card authorized"><span>02</span><RadioTower size={24} /><h3>Provider authorized</h3><p>Operated by an approved media or telemetry partner under provider authority.</p></article>
            <article className="provenance-card community"><span>03</span><Braces size={24} /><h3>Community derived</h3><p>Built from lawful public sources with visible attribution and no implied endorsement.</p></article>
          </div>
        </section>

        <section className="section-wrap final-cta">
          <div><span className="eyebrow">Start with five public values</span><h2>A safer feed is a smaller feed.</h2></div>
          <div><p>Rehearse on synthetic or historical data. Inspect every serialized field. Go live only when your team is ready.</p><Link className="button button-primary" href="/provider">Design a pilot <ArrowRight size={17} /></Link></div>
        </section>
      </main>
      <footer className="site-footer section-wrap">
        <div><strong>RangeRelay</strong><p>Public launch telemetry, deliberately released.</p></div>
        <div><Link href="/explore">Explore</Link><Link href="/provider">Providers</Link><Link href="/consumer">Developers</Link><a href="https://github.com/Colten-Covington/RangeRelay">GitHub</a></div>
        <small>Reference pilot · Not for safety-critical use</small>
      </footer>
    </div>
  );
}
