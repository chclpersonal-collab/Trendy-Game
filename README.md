# Musketeer Battle Simulator

Autonomous two-army musketeer battle simulation. Development is intentionally incremental: each candidate must preserve the established combat and progression invariants, then pass deployed-browser regression tests before a phase can be called stable.

## Current state

- **Current candidate:** Phase 2 **v2.20**
- **Class:** E Class stabilization
- **Experimental Pricing:** **14 / 15**
- **Status:** candidate until the protected Vercel/Playwright gate and human playtest are reviewed
- **Next gate:** v2.21 / Pricing Patch 15/15
- **Phase 3 / D Class:** locked until Phase 2 is stable
- **Commander Form II / Makashi:** locked until the current combat layer is stable

## v2.20 focus — Physical Fieldwork Muster / Emergency Reserve

Patch 14 deliberately holds the global economy at F $10, E $32, $10/s base income, 1.60% living-army-value upkeep per second, and 50% rank-price kill bounties. This isolates the logistics change instead of stacking an economy rebalance on top of it.

The v2.19 fieldwork rule said paid reinforcements were tied to fieldworks, but the implementation still spawned paid musketeers near the fortress. v2.20 closes that mismatch:

- normal paid musketeers physically muster **150 world units behind their fieldwork** in a rear staging zone;
- a viable enemy BREACH within **205 world units** still blocks that paid fieldwork muster;
- if the blocked defender falls below **7 musketeers**, the fortress can release **one emergency F reserve at a time for $15**;
- emergency reserve cannot buy E Class and stops once the army recovers to 7;
- the initial 14-musketeer armies still deploy from the fortress, preserving opening-battle pacing;
- free replacement commanders keep their existing safe-fieldwork / fortress-fallback deployment logic.

The first 55-unit candidate over-strengthened fieldwork reinforcement and caused the established three-seed natural-siege gate to fall to zero fortress hits. The 150-unit rear staging distance is the smallest responsible balance correction being tested next: reinforcements still originate from fieldwork logistics, but they do not appear almost directly on top of a contested line.

## Branch policy

The repository now uses one reusable development branch:

- `main` — accepted/stable baseline
- `agent/current` — **the only development branch used from v2.20 onward**

Do **not** create `update/v2.20`, `update/v2.21`, or other version-specific branches. Version history belongs in commits, PR history, the changelog, and test evidence rather than permanent branches.

Legacy `update/v2.17`, `update/v2.18`, and `update/v2.19` refs are obsolete and should be deleted after their history is confirmed reachable from the rolling branch/main. They are not valid development targets and no CI is triggered from them.

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

A change is not called complete merely because code was written. Candidates are checked against the actual Vercel preview with Playwright for boot/runtime errors, deterministic self-play, fortress pressure, logistics regressions, controls, company cap, roadmap count, treasury/fortress validity, and the current phase/version constants. Human playtesting remains the final balance gate for Phase 2.
