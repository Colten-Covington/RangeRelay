# Provider onboarding runbook

## Goal

Move from interest to a rehearsed, provider-authorized feed without asking a provider to expose raw telemetry or operate an unfamiliar public service during flight.

## Phase 0 — qualification

Ask for no data yet.

1. Name the business owner, technical owner, publication authority, security contact, and 24/7 flight contact.
2. Identify mission/customer/range constraints and whether any government-controlled or payload data touches the candidate source.
3. Decide whether the pilot is synthetic, historical replay, non-flight test, or live.
4. Choose the provenance label. Only the provider can authorize `provider-certified`.
5. Sign pilot terms and confidentiality terms for the onboarding process; the output feed itself must contain only authorized public-release values.

Stop if nobody has authority to classify and approve release.

## Phase 1 — five-field pilot

Start with values the provider already deliberately shows to the public, for example:

- mission elapsed time;
- rounded altitude;
- rounded speed;
- rounded downrange distance;
- a provider-authored phase/milestone label.

These are examples, not presumptively safe fields. Precision, timing, combination, mission, customer, and vehicle matter.

For each field record its definition, units, bounds, precision/quantization, derivation, maximum rate, delay, owner, classification decision, and approval expiry. Produce and sign the schema manifest hash.

## Phase 2 — provider gateway

1. Install the pinned, signed gateway build on a dedicated release host or tightly isolated workload.
2. Configure a field-by-field projection. Wildcards, arbitrary objects, raw packet forwarding, and dynamic field names are disallowed.
3. Grant read-only access to the minimum approved source.
4. Permit outbound network access only to the RangeRelay ingest endpoint and required time/key services.
5. Issue a non-production credential and pin the expected service identity.
6. Run in dry-run mode. Provider reviewers inspect the complete serialized output and audit record.
7. Exercise unknown-field, wrong-type, excess-rate, stale-clock, duplicate, invalid-signature, and network-failure cases.

## Phase 3 — rehearsal

Rehearse a complete synthetic or historical flight at planned and burst rates.

- verify sequence continuity and expected data gaps;
- verify configured precision, rate, delay, and mission window;
- confirm no value appears before its `releaseAt`;
- force `off` locally and in the provider console;
- revoke and rotate the ingest credential;
- simulate RangeRelay unavailability; provider flight systems must be unaffected;
- compare provider local receipts to RangeRelay audit records;
- confirm consumers visibly mark stale/off/corrected data;
- conduct a SEV-0 mistaken-publication tabletop without using actual sensitive data.

## Phase 4 — flight authorization

At T-24 hours (or provider-defined gate), freeze and hash:

- gateway build digest and SBOM;
- projection configuration;
- schema manifest;
- release delay/rate/precision;
- mission start and automatic stop time;
- credential/key identifier;
- provider and RangeRelay escalation roster.

Two provider-authorized people enable `armed`. At the approved time, two-person policy enables `live`. Any authorized incident/operator role can stop it alone.

## Phase 5 — post-flight

1. Automatically stop at the approved end time.
2. Reconcile sequences, rejects, gaps, corrections, and audit receipts.
3. Provider decides whether the public archive remains available and for how long.
4. Rotate/disable mission-scoped credentials.
5. Hold a blameless review covering provider burden, consumer quality, and safety controls.
6. Require a new manifest version and approval for every field or semantic change.

## Go/no-go card

| Gate | Go condition | Automatic no-go |
| --- | --- | --- |
| Authority | Named empowered approvers | “Engineering thinks it is probably public” |
| Schema | Signed exact manifest hash | Wildcard or opaque payload |
| Isolation | Dedicated projection and egress-only path | RangeRelay can reach provider/vehicle systems |
| Rehearsal | Full test and stop drill pass | Stop or automatic expiry untested |
| Legal | Written provider/counsel decision | Export/contract question unresolved |
| Operations | 24/7 contacts and status path tested | No provider decision-maker reachable |

## The provider pitch

> Publish only the five values you already choose to show. Your open-source gateway constructs a new, bounded payload inside your network. You control precision, delay, timing, and a one-click stop. We handle every downstream integration and clearly mark your feed as provider-certified. There is no command path, no raw-data lake, and no fee to the provider.
