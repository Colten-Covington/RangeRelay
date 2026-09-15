# US-first legal readiness checklist

> Planning material, not legal advice. Aerospace/export counsel must review the actual provider, vehicle, mission, fields, users, hosting locations, and agreements before any production telemetry is accepted.

## The central rule

Do not make RangeRelay the place providers send data “just in case it is okay.” The provider must determine that every field and derivation is authorized for public release before transmission. RangeRelay should contractually reject restricted data and technically minimize the chance of receiving it.

US export-control analysis can implicate the International Traffic in Arms Regulations (ITAR) and Export Administration Regulations (EAR). The current ITAR definitions include “technical data” and “public domain” in 22 CFR Part 120, while the EAR scope and release rules are in 15 CFR Part 734. Public availability is a legal conclusion, not a UI setting. Public internet distribution can reach foreign persons immediately.

## Counsel workstreams

| Workstream | Questions requiring a written answer |
| --- | --- |
| Export controls | Is each field/derivation ITAR technical data, EAR technology/software, publicly available/public domain, or otherwise authorized? Does global CDN/support access create an export/reexport issue? |
| Mission contracts | Do launch services, payload, range, government, insurance, or customer terms restrict telemetry or publicity? Who owns derived values and graphics? |
| Trade secrets/confidentiality | Has the provider taken/publicly waived secrecy? Could combinations, precision, timing, or anomalies reveal protected know-how? |
| Cybersecurity | What incident/reporting terms, audit rights, security schedule, breach deadlines, and subcontractor controls apply? Is CUI involved? If yes, this public service is likely the wrong environment. |
| Data/privacy | Are staff, crew, customer, location, device, IP, or account data processed? Define purpose, retention, deletion, subprocessors, and rights handling. |
| Public claims | Who may call a feed “official,” “live,” “accurate,” or “provider-certified”? Require visible latency, source, corrections, and non-safety disclaimer. |
| Scraping/community data | Do source terms, copyright/database rights, API licenses, robots instructions, and rate limits permit collection and redistribution? Never bypass authentication or access controls. |
| Insurance/liability | Evaluate technology E&O, cyber, media liability, contractual indemnity, liability caps, and exclusions for aerospace/export events. |
| Corporate/governance | Decide nonprofit/foundation, public-benefit, or ordinary company only after pilot incentives and funding are known. Maintain an independent safety veto regardless. |

## Required agreement set

1. **Provider telemetry publication agreement** — authority, approved purpose, data ownership/license, field approval process, mission windows, provider warranties, prohibited data, security schedule, suspension, incident cooperation, retention, publicity, liability, and termination.
2. **Signed schema authorization** — immutable manifest hash, approvers, classification basis/reference, precision, rate, delay, region restrictions, effective/expiry time, and emergency contacts.
3. **Data processing/security addendum** — only if personal/confidential data beyond the public feed is processed in provider accounts/support logs.
4. **Consumer terms** — informational/non-safety use, attribution, provenance, rate limits, no false official branding, correction behavior, availability disclaimer, and redistribution rights by tier.
5. **Community-source policy** — source evidence, collection authority, attribution, takedown/dispute workflow, confidence/provenance, and periodic review.
6. **Acceptable use policy** — prohibit operational targeting, attempts to infer or solicit restricted data, credential abuse, and misrepresentation.
7. **Privacy notice** — accounts, logs, cookies, support, retention, subprocessors, contact and rights.
8. **Incident and coordinated disclosure policies** — provider escalation tree, public notice authority, evidence preservation, security reporting channel, safe-harbor language reviewed by counsel.

## Provider schema approval record

Every production schema version should capture:

- legal provider name and mission/program;
- source system owner and approving publication authority;
- field name, description, type, unit, bounds, precision and maximum rate;
- raw/derived status and derivation owner;
- classification decision and supporting reference, without copying restricted analysis into RangeRelay;
- contractual/customer/range approval as applicable;
- delay and mission start/end window;
- countries/regions or personnel restrictions, if any (prefer not to publish if restrictions are required);
- two approvers, signature/time, manifest SHA-256;
- stop contacts and 24/7 escalation method;
- retention and post-flight archive decision.

## Takedown and mistaken-publication reality

RangeRelay must promise rapid suspension and reasonable takedown from systems it controls, not deletion from the internet. Consumer terms and provider agreements must say that public recipients can cache or republish events. The provider console should display this warning immediately before enabling `live`.

## Preflight legal gate

- [ ] Provider entity and signer authority verified.
- [ ] Mission/customer/range publication permissions verified.
- [ ] Export classification/release authorization documented by qualified authority.
- [ ] Schema manifest approved and hashed; no wildcard fields.
- [ ] Provider accepts irreversibility warning.
- [ ] Hosting/subprocessors/regions approved.
- [ ] Insurance and liability allocation approved.
- [ ] Incident contacts tested.
- [ ] Consumer provenance label and disclaimer reviewed.
- [ ] Expiration automatically returns channel to `off`.

## Primary references to keep current

- eCFR, 22 CFR Part 120 (including technical-data and public-domain definitions): https://www.ecfr.gov/current/title-22/chapter-I/subchapter-M/part-120
- eCFR, 15 CFR Part 734 (EAR scope and release concepts): https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-734
- BIS export compliance resources: https://www.bis.gov/
- NIST Secure Software Development Framework, SP 800-218: https://csrc.nist.gov/publications/detail/sp/800-218/final

Recheck the current law and agency guidance at each provider onboarding; citations and classifications change.
