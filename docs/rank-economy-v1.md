# Rank Economy, HP, Mana, Range and Shield Foundation

## Classification

**v3.4.3 candidate / export-led balance foundation / not yet an accepted release.**

This design intentionally establishes a coherent 15-rank data model now while keeping only the currently unlocked F, E, D and C ranks purchasable and earnable. B through SSS+ Type V remain roadmap-locked until their phases are reached.

## Corrected Rank Names and Baseline Profiles

The final rank is **SSS+ Type V**, correcting the omitted plus sign in “SSS Type V.”

| Rank | Purchase cost | Max HP | Max Mana | Musket range | Mana regeneration / s | Battlefield role |
|---|---:|---:|---:|---:|---:|---|
| F | $15 | 100 | 20 | 215 | 0.12 | line shield |
| E | $30 | 115 | 30 | 230 | 0.16 | veteran shield |
| D | $45 | 130 | 42 | 245 | 0.20 | assault support |
| C | $60 | 145 | 55 | 260 | 0.24 | volley support |
| B | $75 | 165 | 70 | 275 | 0.28 | protected marksman |
| A | $90 | 190 | 90 | 290 | 0.32 | protected marksman |
| S | $150 | 230 | 120 | 315 | 0.40 | elite rear line |
| SS | $300 | 290 | 170 | 345 | 0.50 | elite rear line |
| SSS | $450 | 360 | 230 | 380 | 0.62 | strategic rear line |
| SSS+ | $600 | 450 | 310 | 420 | 0.76 | strategic rear line |
| SSS+ Type I | $750 | 560 | 400 | 460 | 0.92 | specialist rear line |
| SSS+ Type II | $900 | 700 | 510 | 505 | 1.10 | specialist rear line |
| SSS+ Type III | $1,500 | 900 | 680 | 560 | 1.35 | siege specialist |
| SSS+ Type IV | $3,000 | 1,250 | 950 | 635 | 1.70 | siege specialist |
| SSS+ Type V | $15,000 | 2,200 | 1,800 | 750 | 2.50 | final strategic unit |

HP, Mana and range increase strictly at every rank. These numbers are a first coherent baseline, not a final balance claim; later export-state evidence may justify tuning them.

## Economy Rules

- Soldier maintenance/upkeep is exactly **$0 per second**.
- Passive income remains **$10 per second** for the first export-led calibration.
- The established E-fortress income bonus remains active.
- The established kill bounty remains 50% of the defeated rank’s purchase price.
- Rank composition no longer creates an income bonus.
- Current unlocked direct purchases remain F, E, D and C only.
- Future-rank prices are fully defined now but cannot be purchased before their roadmap phase.

This isolates the user-requested removal of maintenance while preserving familiar income sources for comparison against prior export states.

## Mana and Range

- The established 205-unit musket range remains free and does not consume Mana.
- Firing beyond 205 units consumes Mana in 50-unit range steps.
- A soldier cannot fire beyond its rank-specific range.
- Mana regenerates continuously at the rank-specific rate.
- Higher ranks therefore gain a real range advantage without receiving unlimited free long-range fire.
- Extended-range fortress fire is available only under SIEGE or BREACH orders.

## Shield Doctrine

Lower-rank musketeers serve as physical screens for higher-rank musketeers:

- When musket fire targets a higher-rank soldier, a living lower-rank ally physically between the shooter and target intercepts the shot.
- The closest eligible screen on the firing line receives the shot.
- Screening is positional, not a global percentage reduction.
- Commanders are not screened by this rank rule.
- This initial implementation applies to musket fire. Melee, saber and future special abilities remain separate systems.

## Promotion and Resources

- Direct purchases spawn at full rank-specific HP and Mana.
- Promotion increases maximum HP and Mana to the new rank profile.
- The existing +20 HP earned-XP healing remains; promotion does not silently add a second full heal.
- Existing F→E, E→D and D→C XP thresholds remain unchanged in this candidate.

## Export-Led Calibration

Future uploaded exports should be used to adjust, rather than guess, the following:

- treasury growth after maintenance removal
- purchases by rank and time-to-first E/D/C
- living rank distribution
- total and per-rank HP pools
- Mana depletion and regeneration
- extended-range shots and effective hit rates
- shielding interceptions by side and rank
- fortress-hit frequency and first-war duration
- army size, company count and recruitment-block frequency
- stat-training spend versus soldier procurement

## Protected Invariants

- zero musketeers at the start of each war
- maximum 150 musketeers per army
- maximum 14 musketeers per company
- maximum 11 companies per army
- fortress spawning and fieldwork logistics remain unchanged
- no live-soldier reassignment
- no future rank is unlocked early
- Commander Forms I and II remain unchanged