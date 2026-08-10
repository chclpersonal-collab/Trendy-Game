# Musketeer Battle Simulator

Autonomous two-army musketeer battle simulation. Development is incremental and evidence-gated: implementation is not considered complete until the exact deployed candidate passes browser regression tests and its balance implications are reviewed.

## Current state

- **Current candidate:** Phase 2 **v2.20**
- **Class:** E Class stabilization
- **Experimental Pricing:** **14 / 15**
- **Patch 14 policy:** controlled hold at F $10, E $32, $10/s base income, 1.60% living-army-value upkeep/s, and 50% defeated-rank kill bounty
- **Phase 3 / D Class:** locked until Phase 2 is stable
- **Commander Form II / Makashi:** locked until the current combat layer is stable
- **Next gate:** v2.21 / Pricing Patch 15/15

## v2.20 — Siege Baseline Preservation / Development Consolidation

v2.20 intentionally avoids stacking new combat or economy balance changes on top of the newly proven v2.19 natural breakthrough. Its job is to preserve that baseline, audit a proposed reinforcement change, harden deployed regression coverage, and simplify the repository workflow.

### Fieldwork audit result

A proposed v2.20 change moved normal paid musketeer spawns from the fortress to a forward fieldwork staging point. It was rejected after deployed-browser testing:

- 55 units behind the fieldwork: the unchanged three-seed × 600-second natural-siege gate fell to **0 fortress hits**.
- 150 units behind the fieldwork: the same gate again produced **0 fortress hits**.
- In the 150-unit run, emergency-reserve logic triggered **0 times**, so it was not the cause of the regression.
- Seed 21902, which had reached roughly 214 units from a fortress in the verified v2.19 sample, only reached roughly 678 units in the 150-unit experiment.

Therefore fieldworks remain **logistics-control nodes**, not forward troop spawn points. A viable enemy BREACH within one musket range still blocks paid recruitment; once relieved, paid musketeers continue to deploy physically from the fortress. This preserves the proven siege balance instead of compensating for a failed reinforcement concept with arbitrary attacker buffs.

## Branch policy

From v2.20 onward there is one active development branch:

- `main` — accepted/stable baseline
- `agent/current` — the single rolling development branch

Do not create version-specific development branches such as `update/v2.20` or `update/v2.21`. Versions are preserved by commits, PR history, changelog entries, and test artifacts rather than permanent branches.

Legacy `update/v2.17`, `update/v2.18`, and `update/v2.19` refs are obsolete. Their PRs are closed and CI no longer runs on them. Physical deletion of those refs is cleanup-only and does not change the active workflow.

## Hard invariants

- 15-phase class roadmap remains intact.
- Only F and E are unlocked in Phase 2.
- Maximum 14 musketeers per commander/company.
- Base musket reload remains 30 seconds.
- F melee exists only during temporary commander counter-charge orders; E keeps its autonomous bayonet charge.
- Commander Form I is Shii-Cho only. Forms II–VII keep their canonical identities and remain locked.
- Movement and commander replacement remain physical; no teleport regrouping.
- Command remains local rather than global.
- Fortress HP, treasury, actors, and telemetry must remain finite and valid.

## Roadmap

1. **F Class — STABLE**
2. **E Class — NOW: stabilization / Pricing 14–15**
3. **D Class — NEXT, LOCKED**
4. C Class
5. B Class
6. A Class
7. S Class
8. SS Class
9. SSS Class
10. SSS+ Class
11. SSS+ Class Type I
12. SSS+ Class Type II
13. SSS+ Class Type III
14. SSS+ Class Type IV
15. SSS+ Class Type V — final

## Verification policy

The protected Vercel preview is tested with Playwright for boot/runtime errors, deterministic self-play, natural fortress pressure, fieldwork recruitment blocking/reopening, controlled BREACH damage, controls, company cap, roadmap count, treasury/fortress validity, and the current phase/version constants. A failed experiment stays failed in the evidence; acceptance tests are not weakened to make a candidate pass.
