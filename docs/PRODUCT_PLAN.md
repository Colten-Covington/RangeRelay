# RangeRelay product plan

## 1. Problem and answer

Launch providers have little incentive to build one-off integrations for every streamer or app, and substantial downside if an engineer accidentally exposes proprietary, mission-restricted, security-sensitive, or export-controlled information. Consumers meanwhile scrape broadcasts, OCR graphics, and reverse-engineer feeds, producing fragile and sometimes misleading data.

RangeRelay changes the exchange: providers get one small, free, provider-controlled publication surface; consumers get a stable, well-documented API with provenance. The product succeeds only if publishing is safer and cheaper than answering integration requests—or doing nothing.

## 2. Working name

**Recommended: RangeRelay**

- “Range” is specific to launch operations without naming one company or vehicle.
- “Relay” correctly promises distribution, not analysis or operational control.
- It works as a service, protocol, SDK, and provider gateway name.

Alternates retained for a formal naming screen: MissionStream, FlightSignal, and Public TLM. Do not use LaunchCast; that name is already in active use by a launch-tracking product. Search-engine screening is not trademark clearance; commission a US and international knockout search before spending on identity or domains.

## 3. Users and jobs

| User | Job | Initial value |
| --- | --- | --- |
| Launch provider communications | Publish approved facts without exposing internal systems | One controlled integration and an emergency stop |
| Provider security/legal | Bound and prove what can leave | Schema approval, deny policy, audit receipts, delay |
| Streamer/broadcaster | Drive graphics reliably | Normalized units, schema, SSE, replay |
| App developer | Build once across missions | Stable event contract and provenance |
| Educator/accessibility builder | Explain a flight live | Derived metrics, event markers, captions-ready metadata |
| Community contributor | Improve public coverage | Clearly labeled derived feeds and reproducible adapters |

## 4. Product lanes

### Lane A — Provider-certified

The provider controls the release gateway, schema, start/stop state, delay, precision, and mission window. Events are signed and marked `provider-certified`. This is the trust target.

### Lane B — Provider-authorized

An approved media or telemetry partner operates an adapter under a provider agreement. The provider can revoke authorization. This is useful when a provider will approve a feed but will not operate software.

### Lane C — Community-derived

Adapters use lawfully available public sources such as published APIs, press kits, captions, or on-screen values. Every field carries source attribution and `community-derived` provenance. Never imply provider endorsement. Site terms, licenses, robots instructions, and rate limits must be reviewed per source; do not bypass access controls.

These lanes may share a consumer contract, but must never share trust badges, signing roots, or unlabeled records.

## 5. Minimum lovable product

The first public release should include:

1. Channel directory and machine-readable schemas.
2. REST snapshots and replay plus SSE live delivery.
3. Provider gateway with explicit projection, quantization, delay, dry-run preview, and local audit output.
4. HMAC initially; mTLS and managed asymmetric signing before provider pilot.
5. Provider console for schema review, mission windows, dual approval, live health, stop, and post-flight export.
6. JavaScript/TypeScript consumer SDK and OBS/browser-source example.
7. Provenance on every channel and event.
8. Public status page, incident policy, and versioned changelog.

Not in v1: commands, raw packet decommutation as a hosted service, private engineering-data storage, payload data, crew data, predictive anomaly declarations, or promises of safety/mission correctness.

## 6. Business and incentive model

Providers should not be the first payer. Their upside is free tooling, a consistent public narrative, fewer bespoke requests, lower support burden, better accessibility, and verifiable attribution.

Revenue comes from consumers who need commercial reliability:

| Tier | Price hypothesis | Included |
| --- | ---: | --- |
| Community | Free | Best-effort live/replay, attribution required |
| Creator | $19–49/month | Higher limits, browser widgets, alerts, saved layouts |
| Broadcast | $250–1,500/event | SLA, rehearsals, support bridge, redundant endpoints |
| Platform | Contract | High-volume redistribution, archive export, dedicated capacity |

Validate willingness to pay before building billing. Never sell preferential truth: the underlying public values stay the same across tiers.

## 7. Success metrics

North star: **monthly live missions with at least one non-RangeRelay production consumer**.

Leading measures:

- time from SDK download to first valid test event: under 30 minutes;
- provider engineering effort for a basic feed: under one day after schema agreement;
- rejected unsafe/unknown fields: 100%, fail closed;
- public event delivery p95: under 500 ms plus configured provider delay;
- recovery point: no accepted certified event lost;
- schema-breaking changes without a new major version: zero;
- provenance displayed by supported clients: 100%;
- provider stop propagation: under 2 seconds at RangeRelay edges.

## 8. Twelve-week execution plan

| Weeks | Outcome | Exit gate |
| --- | --- | --- |
| 1–2 | Discovery and trust package | 10 consumer interviews, 3 provider/comms interviews, counsel issue memo |
| 3–4 | Contract and SDK alpha | Versioned schema, TypeScript SDK, replay/SSE conformance suite |
| 5–6 | Production data plane | Durable log, multi-region fanout, object archive, idempotency |
| 7–8 | Provider release gateway | Signed binary/container, projection language, dry run, SBOM, auto-update policy |
| 9 | Control plane | Tenant/RBAC, dual approval, key rotation, immutable audit receipts |
| 10 | Consumer demos | OBS overlay, Open MCT adapter, example launch dashboard |
| 11 | Rehearsal | Synthetic full-flight load, stop/revoke drill, regional failure, restore |
| 12 | Private pilot | One non-flight simulation or sounding-rocket/academic mission |

### P0 before a real flight

- Written provider authority identifying who may approve publication.
- Export-control and mission-contract review documented by qualified counsel/provider officials.
- Provider-signed schema manifest and release policy hash.
- No shared secrets in source control; managed HSM/KMS custody and tested rotation.
- mTLS on ingest, tenant isolation, WAF/rate controls, append-only audit store.
- Dual approval for `live`; a single authorized operator may always move to `off`.
- Third-party penetration test and dependency/SBOM review.
- Incident response exercise with provider contacts and prewritten public notices.
- Cyber, technology E&O, and media liability insurance evaluated.

## 9. Pilot strategy

Do not open by asking SpaceX for live Falcon engineering telemetry. Start with a partner whose approvals and mission are tractable: a university launch team, sounding-rocket program, amateur/high-power flight operating legally, engine-test livestream, or launch provider’s synthetic replay.

The first provider ask is: “Give us five values you already show publicly, through a provider-side projection you can inspect and stop.” A successful synthetic rehearsal and post-flight replay are meaningful steps even if live publishing is initially denied.

## 10. Decision log

| Decision | Why | Revisit when |
| --- | --- | --- |
| Provider-side projection, not raw ingest | Prevents an accidental raw-data lake | Never without a separate certified environment and business case |
| One-way telemetry only | Eliminates command-path risk | Not planned |
| SSE before WebSocket | CDN/proxy friendly and simple for viewers | Bidirectional subscriptions or very high fanout require it |
| Simple public JSON plus XTCE import later | Consumer usability first; keep standards bridge | First provider has an XTCE database it may lawfully export |
| Open-source gateway | Providers can inspect and pin exact behavior | Revisit only for separately licensed enterprise modules |
| US-first legal readiness | Initial team and likely providers are US-based | Before onboarding a non-US provider or hosting region |

## 11. Immediate backlog

1. Interview script and target list.
2. `rangerelay-event` JSON Schema and conformance fixtures.
3. PostgreSQL control-plane schema; durable event log adapter.
4. Asymmetric event signing and public verification keys.
5. Gateway projection DSL with a static “no passthrough” guarantee.
6. Precision/minimum-delay policy presets.
7. Provenance model at field level.
8. Provider console wireframes and RBAC matrix.
9. Synthetic flight generator and soak/load harness.
10. Consumer SDK, OBS graphic, and Open MCT adapter.
