# Trust, safety, and data governance

## Safety thesis

The safest sensitive record is one RangeRelay never receives. A provider-side gateway creates a new public dataset from an explicit schema; it does not forward, redact, or store raw telemetry. Redaction asks software to recognize every secret. Projection requires software to recognize only approved output.

## Classification

| Class | Examples | RangeRelay treatment |
| --- | --- | --- |
| Public-approved | MET, rounded altitude/speed, public milestone | Allowed after written schema authorization |
| Public-derived | Rounded/quantized value, provider-authored phase label | Allowed; derivation documented |
| Embargoed-public | Approved values released after a delay/window | Held only for configured release; minimize retention |
| Proprietary/restricted | Raw engineering channels, nonpublic anomaly detail, payload/customer data | Prohibited |
| Security/safety critical | Flight termination, command/auth material, security topology, precise protected trajectories | Prohibited |
| Regulated personal data | Crew/staff identity or location not already approved for release | Prohibited by default |

`unknown` is prohibited, not tolerated.

## Required provider controls

1. **Dedicated release host.** Separate process/container and credentials; outbound-only access to a single ingest destination.
2. **Projection, never passthrough.** Output is constructed field by field. Wildcards and “include all except” rules are forbidden.
3. **Schema manifest.** Field name, meaning, unit, type, bounds, precision, derivation, delay, classification, owner, and approval expiration.
4. **Two-person enablement.** Security/legal or delegated data owner plus mission communications/operations approve `armed → live` in production.
5. **One-person stop.** Any authorized provider incident/operator role may immediately force `off`; restoration requires dual approval.
6. **Fail closed.** Unknown field, type, range, schema hash, stale clock, excess rate, invalid signature, or expired mission window is rejected.
7. **Data minimization.** Use rounded, derived, and lower-rate values when exact values add no public benefit.
8. **Delayed release.** Provider chooses zero or positive delay. Delay is a risk control, not a substitute for classification.
9. **Dry run.** A preview records exactly what would have become public without transmitting externally.
10. **Receipts.** Provider receives signed acceptance/rejection receipts and can compare their local audit sequence to RangeRelay’s append-only record.

## Important limits

- Revocation stops future distribution. It cannot recall data already delivered, recorded, mirrored, screenshotted, or cached.
- A delay cannot make prohibited data safe by itself.
- Encryption protects transport/storage; it does not authorize publication.
- Schema validation reduces accidental release but cannot decide export classification or contractual rights.
- Consumers must treat feeds as informational and non-safety-critical. Gaps, delays, corrections, and provider stops are normal states.

## Threat model

| Threat | Control | Residual risk/action |
| --- | --- | --- |
| Extra internal field leaks | Provider projection + platform allowlist + immutable deny rules | Human-approved field itself may still be sensitive; require classification |
| Stolen ingest credential | mTLS, managed asymmetric keys, short mission windows, rotation, rate limits | Stop channel and revoke key; investigate accepted sequence |
| Replay/injection | Timestamp window, idempotent event IDs, monotonic sequence, signatures | Persist replay state across regions in production |
| Compromised consumer | Public data only; scoped commercial tokens | Public data can be republished; terms cannot technically recall it |
| Provider operator error | Dry run, diff preview, dual approval, max precision/rate policy | Emergency stop and incident playbook |
| Platform insider | Least privilege, dual-control policy changes, HSM/KMS, append-only audit | Background/contract controls and independent review |
| DDoS during launch | CDN, admission control, separate ingest/read planes, prewarmed capacity | Graceful degraded snapshots and replay |
| False provenance | Separate signing roots/badges per provenance class | Public verification endpoint and transparency log |
| Misleading stale value | `observedAt`, `receivedAt`, `releaseAt`, sequence, heartbeat, explicit stale state | SDK must never silently hold last value as live |

## Incident severity

| Severity | Example | First action |
| --- | --- | --- |
| SEV-0 | Suspected restricted/export-controlled/security-critical publication | Stop affected and related channels; preserve evidence; call provider and counsel |
| SEV-1 | Unauthorized field or compromised provider credential | Stop channel, revoke credential, enumerate recipients/events |
| SEV-2 | Material integrity/provenance error | Mark feed unavailable/corrected; notify consumers and provider |
| SEV-3 | Availability or latency breach | Fail over/degrade, publish status, preserve replay |

For SEV-0/1, do not delete evidence ad hoc. Isolate access, preserve immutable logs, record decision authority, and follow provider/counsel instructions. Public communications must not repeat the sensitive value. The incident team should know that downstream public copies may exist even after source removal.

## Production security baseline

- Separate provider, control-plane, and public-read identities and networks.
- TLS 1.3 where supported; mTLS for provider ingest.
- Asymmetric per-provider/per-environment keys; hardware-backed custody.
- SSO, phishing-resistant MFA, RBAC/ABAC, just-in-time administration.
- Signed builds, pinned dependencies, SBOM, provenance attestations, secret scanning.
- Tenant-partitioned durable event log; encrypted object archive; retention enforcement.
- Append-only audit records exported to an independent security account.
- WAF, quotas, circuit breakers, load shedding, multi-region public reads.
- Continuous schema/policy conformance testing and periodic external assessment.
- Backups and restore exercises; documented RPO/RTO.

Use NIST SP 800-218 SSDF as the development baseline and map operational controls to the organization’s selected NIST CSF/800-53 profile. Certification claims such as SOC 2 should be made only after a scoped audit.
