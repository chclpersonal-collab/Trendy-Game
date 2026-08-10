# Musketeer Battle Simulator

Autonomous two-army musketeer battle simulation. Development is incremental and evidence-gated: implementation is not considered complete merely because code was written. Material claims must survive the exact deployed-browser regression gate, and Phase stability still requires human playtesting when balance and feel matter.

## Current state

- **Current candidate:** Phase 2 **v2.21**
- **Class:** E Class final stabilization
- **Experimental Pricing:** **15 / 15 — scheduled calibration series complete**
- **Status:** **AUTOMATED VERIFIED CANDIDATE**
- **Verified gameplay commit:** `ea1803f262263edf616da3348f152242bfa3c08b`
- **Protected Playwright run:** `31350330442` — **8/8 passed**
- **Economy hold:** F $10, E $32, $10/s base income, 1.60% living-army-value upkeep/s, 50% defeated-rank kill bounty
- **Human playtest:** **REQUIRED / NOT YET COMPLETED**
- **Phase 3 / D Class:** **BLOCKED until Phase 2 is declared stable**
- **Commander Form II / Makashi:** locked

Patch 15 completes the planned pricing-calibration sequence; it does **not** make these values immutable. Future evidence may still justify a balance change.

## v2.21 — Final Pricing Calibration / Command-Recovery Audit

### Pricing Patch 15/15

v2.21 deliberately holds the proven v2.20 economy and combat constants rather than forcing a last-minute price change for the sake of changing a number:

- F Class: **$10**
- E Class: **$32**
- base passive income: **$10/s**
- upkeep: **1.60% of living army value/s**
- kill bounty: **50% of defeated rank price**
- base musket reload: **30s**
- company cap: **14 musketeers per commander**

Four deterministic 600-second economy samples remained finite and active. The highest sampled treasury was about **$610.62**, far below the earlier pre-upkeep multi-thousand runaway behavior. Across the four samples there were **287 direct E-Class purchases** and **21 earned F→E promotions**, so the economy did not achieve stability merely by suppressing progression.

### Command-recovery audit

v2.20 natural runs still showed large temporary uncommanded populations, so v2.21 tested a seemingly reasonable recovery change: let soldiers treat a living but company-separated commander as a physical fallback regroup target.

That experiment **failed** the unchanged natural-siege acceptance gate:

- all three 600-second siege seeds produced **0 fortress hits**;
- seed 21902 lost the v2.20 breakthrough and only reached roughly **656–765** units from the fortresses instead of the established ~214-unit conversion;
- the new fallback caused heavy rejoin churn, with large portions of companies chasing commanders that were already physically returning toward their company.

The experiment was therefore removed. The accepted rule remains simpler:

- a separated living commander physically returns toward the company;
- soldiers keep the existing local rejoin behavior once company command is functioning again;
- precise tactical orders are not restored early;
- command radius remains 180 at company-integrity level and 350 for individual soldier command.

A deployed regression now proves the separated commander physically closes distance at the existing **28 units/s** joining speed while remaining out of command after the first second, so there is no hidden teleport or premature command restoration.

## Final deployed verification

The exact protected Vercel deployment for commit `ea1803f262263edf616da3348f152242bfa3c08b` passed **8/8** Playwright tests in **55.7 seconds** of browser-test execution.

### Economy calibration — 4 × 600 seconds

Observed maximum treasuries by seed stayed approximately between **$430 and $611**. All four runs preserved finite state, nonnegative treasury, valid fortress HP, the 14-musketeer company cap, and the 15-phase roadmap. Direct E purchases and earned E promotions occurred in every sampled run.

### Natural siege — 3 × 600 seconds

- Seed 21901: **0 fortress hits**.
- Seed 21902: Right produced **4 fortress hits**, reached about **214.022** minimum fortress distance, and reduced the upgraded Left fortress from 6500 HP to about **6466.63**.
- Seed 21903: **0 fortress hits**.

This exactly restores the important v2.20 natural-breakthrough pattern after rejecting the disruptive recovery experiment. It proves natural fortress conversion remains possible; it does not prove its frequency is perfectly balanced.

### Other deployed regressions

The v2.21 gate also passed:

- boot/runtime and Patch 15 invariants;
- deterministic 300-second self-play;
- physical separated-commander return without early command restoration;
- fieldwork recruitment block and immediate reopening after relief;
- controlled BREACH → real fortress damage;
- Pause / Speed / Front controls;
- canonical Form I–VII identities and current Form I lock.

## Known limitations / open audit findings

- Natural samples still reached **peak uncommanded populations as high as 56**. This remains an open cohesion problem, not a solved claim.
- The rejected soldier-to-separated-commander fallback shows that a naive cohesion fix can damage siege behavior. Future cohesion work needs to preserve forward tactical continuity rather than simply minimizing the uncommanded counter.
- The raw pre-JavaScript `game.html` still contains some legacy v2.19 / Pricing 13 labels; runtime JavaScript immediately presents v2.21 correctly. Removing that stale static metadata is a nonfunctional simplification task, not a gameplay blocker.
- Human Vercel playtesting has not yet been completed for v2.21, so **Phase 2 is not declared stable**.

## Branch policy

From v2.20 onward there is one active development branch:

- `main` — accepted/stable baseline
- `agent/current` — the single rolling development branch

Do not create version-specific development branches such as `update/v2.21` or `update/v2.22`. Versions are preserved by commits, PR history, changelog entries, and test artifacts.

Legacy `update/v2.17`, `update/v2.18`, and `update/v2.19` refs remain obsolete cleanup refs. Their PRs are closed and CI does not use them. Physical deletion remains blocked by the currently available GitHub connector, which exposes no branch-ref deletion operation.

## Hard invariants

- 15-phase class roadmap remains intact.
- Only F and E are unlocked in Phase 2.
- Maximum 14 musketeers per commander/company.
- Base musket reload remains 30 seconds.
- F melee exists only during temporary commander counter-charge orders; E keeps its autonomous bayonet charge.
- Commander Form I is Shii-Cho only. Forms II–VII retain their canonical identities and remain locked.
- Movement and commander replacement remain physical; no teleport regrouping.
- Command remains local rather than global.
- Fortress HP, treasury, actors, and telemetry must remain finite and valid.

## Roadmap

1. **F Class — STABLE**
2. **E Class — NOW: v2.21 automated gate passed; human stabilization playtest pending**
3. **D Class — NEXT CLASS, BLOCKED until Phase 2 stability verdict**
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

### Immediate next work

**NOW**
- Human Vercel playtest of v2.21: pacing, fieldwork fairness, siege readability, recovery behavior, economy feel, and whether E progression feels meaningfully stronger without becoming dominant.
- Review the high-uncommanded episodes visually rather than optimizing the telemetry number in isolation.

**NEXT**
- If human playtesting finds a material Phase 2 problem: make a focused v2.22 stabilization patch on `agent/current` and re-run the full deployed gate.
- If human playtesting supports stability: record the Phase 2 stability verdict, then begin scoped D-Class design while keeping Form II locked unless its own roadmap gate is reached.

**LATER**
- Remove stale pre-JavaScript version labels and reduce remaining version-copy indirection.
- Continue class phases 3–15 only after each prior phase satisfies its own evidence gate.

## Verification policy

A failed experiment stays failed in the evidence; acceptance tests are not weakened to make a candidate pass. Automated evidence can prove the tested invariants and deterministic scenarios, but human playtesting remains the final balance/feel gate before Phase 2 can be called stable.
