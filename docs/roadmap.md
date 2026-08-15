# Musketeer Battle Simulator Roadmap

## NOW — v3.5 Performance Stabilization

### User-reported blocker

The first ordinary v3.5 playtest became severely unresponsive, reportedly reaching approximately one rendered frame per second.

Export `musketeer-state-v3.5.0-seed-3101678311-war-1-t-153s.json` recorded the slowdown at:

- 153.113 simulated seconds
- 4× speed
- 83 living musketeers and 12 commanders
- 95 living actors total
- six companies per side
- only one active shot and zero smoke particles
- 1280×631 viewport at device-pixel ratio 2

This is far below the 150-soldier-per-army limit and rules out particle saturation as the primary explanation. The export contains no CPU profile, so the causal diagnosis is based on the active code path at this exact population.

### v3.5 target-cache/UI-cadence hotfix

**Classification: performance bug fix; no intended balance change.**

Root cause in the active v3.5 implementation:

- every shield-aware target request copied and sorted the enemy pool;
- every sort comparison recomputed target scores;
- every score rescanned the same pool for potential lower-rank shields;
- base combat, rank formation, and extended-range layers could request the same actor target repeatedly in one simulation step;
- the full text information rail was rewritten every rendered frame.

Implemented hotfix design:

- one shield-candidate index per actor-update step;
- single-pass target minimum with the established score and actor-ID tie-break;
- per-step actor/mode caches for `enemy`, `combat`, `siege`, and `breach` targets;
- dead cached targets are recomputed immediately;
- rear-threat, siege-range, BREACH-range, commander-fallback, shield-depth, shield-lane, and shield-penalty behavior are preserved;
- direct test/helper targeting calls remain uncached so manual actor movement is immediately visible;
- text UI refresh is reduced to 10 Hz while simulation and canvas rendering remain on `requestAnimationFrame`;
- exports gain targeting, step-time, frame-time, FPS, and UI-update telemetry.

Detailed evidence and acceptance gate: `docs/v3.5-performance-hotfix.md`.

### Performance acceptance gate

- Existing shield-selection and rank-formation tests remain green.
- A controlled scenario creates at least 90 living actors.
- Full-pool target sorts: exactly zero.
- Repeated same-step target requests produce cache hits.
- Last-step candidate evaluations stay below four full living-actor matrix passes.
- Last-step shield checks remain locally bounded rather than rescanning every enemy for every comparator.
- Two seconds of export-sized synchronous simulation completes within five seconds on the GitHub runner.
- A crowded 4× browser probe produces more than 15 animation frames over 1.6 seconds.
- UI updates stay within the 100 ms refresh budget.
- All economy, HP/Mana/range, rank-lock, company, fortress, command, and finite-value invariants remain valid.

### Current status

**IMPLEMENTED CANDIDATE / DEPLOYMENT AND FULL VERIFICATION REQUIRED.**

The user export proves the symptom and supplies the population/state boundary. It does not itself prove post-hotfix frame rate; deployed automated evidence and a fresh real-device run are still required.

## v3.5 Ranked Economy / Combat Profile Foundation

### Change class

**MAJOR** — intentional economy and combat-contract change authorized by the user. Purchase prices, recurring costs, unit durability, Mana, range, targeting priorities, export metadata, and balance assumptions changed.

### Corrected rank ladder

The final user entry `SSS Type V` is normalized to **SSS+ Type V**.

| Rank | Cost | HP | Mana | Mana/s | Range | Formation layer |
|---|---:|---:|---:|---:|---:|---:|
| F | $15 | 100 | 0 | 0.00 | 205 | +30 front |
| E | $30 | 115 | 24 | 0.40 | 220 | +22 |
| D | $45 | 135 | 36 | 0.55 | 235 | +14 |
| C | $60 | 160 | 52 | 0.75 | 250 | +6 |
| B | $75 | 190 | 70 | 0.95 | 265 | -4 |
| A | $90 | 225 | 90 | 1.15 | 280 | -14 |
| S | $150 | 280 | 120 | 1.45 | 300 | -26 |
| SS | $300 | 360 | 160 | 1.85 | 325 | -38 |
| SSS | $450 | 460 | 210 | 2.30 | 350 | -50 |
| SSS+ | $600 | 600 | 280 | 2.90 | 380 | -62 |
| SSS+ Type I | $750 | 760 | 360 | 3.60 | 410 | -74 |
| SSS+ Type II | $900 | 950 | 460 | 4.50 | 445 | -86 |
| SSS+ Type III | $1,500 | 1,250 | 620 | 6.00 | 485 | -100 |
| SSS+ Type IV | $3,000 | 1,750 | 900 | 8.50 | 535 | -115 |
| SSS+ Type V | $15,000 | 3,000 | 1,600 | 14.00 | 620 | -135 rear |

### Economy contract

- Soldier maintenance/upkeep is removed: `$0/s`.
- Passive income remains `$10/s` pending export calibration.
- E-fortress income bonus remains `$2/s`.
- Rank-quality passive-income bonuses are removed.
- Kill bounty remains 50% of defeated-rank purchase price.
- Starting treasury remains `$175`.
- Fortress upgrades and army-stat training retain their existing costs for the first economy slice.
- Only F/E/D/C are purchasable; B through SSS+ Type V remain roadmap-locked.

### HP, Mana, range, and shielding contract

- Direct purchases spawn at full rank HP and Mana.
- Promotion preserves damage, applies the established +20 XP heal, and grants only the new capacity difference.
- Basic musket fire costs zero Mana.
- E-or-higher bayonet charge costs 8 Mana.
- C formal-volley shots cost 3 Mana; insufficient Mana falls back to ordinary fire.
- Every successive rank has longer musket range.
- Organized SIEGE/BREACH fortress fire may use rank range.
- Lower ranks occupy more-forward ordinary formation layers.
- SIEGE, BREACH, CHARGE, TURN, RALLY, and REGROUP are excluded from forced rank layering.
- A lower-rank screen within 125 horizontal and 90 vertical units strongly discourages bypass targeting without making the shield invulnerable.

### Balance status

The supplied 153-second export shows:

- zero maintenance functioning;
- both E fortresses purchased;
- living armies of 44 and 39 musketeers;
- 63 and 67 cumulative purchases;
- treasuries of approximately $366 and $216;
- rank purchases already including E, D, and C;
- no siege push or fortress hit yet, which is expected this early and is not a long-war result.

Balance calibration is postponed until performance is stable enough to gather representative 600–2,200-second exports.

## REJECTED / SUPERSEDED

### v3.4.1 active-BREACH recruit priority

- Run `31483950617`: 34/40.
- Long-war result: 0/3; all nine natural-siege seeds produced zero fortress hits.
- Artifact `9098617893`, SHA256 `2c3f2217b651e36a0497f58253cf0c3501d1a2f787746a6d11dcedffdeef2285`.

### v3.4.2 BREACH continuity hysteresis

- Run `31673977561`: 39/40.
- Focused continuity passed and seed `32208` retained two fortress hits.
- Strict long-war result remained 0/3 with zero fortress damage.
- Artifact `9170990259`, SHA256 `9b3670cfc4983e6cb1a0c08133eccc91a07b4cb597e3ddd65f5fe6988d6dadd3`.

Neither rejected BREACH layer is active in v3.5.

## NEXT

1. Complete deployed verification of the performance hotfix.
2. Collect a fresh real-device v3.5 export after at least 600 simulated seconds if responsiveness permits.
3. Use performance telemetry to confirm frame/step stability at larger populations.
4. Resume economy calibration only after the game remains responsive.
5. Tune passive income, reserves, bounty, training costs, rank shares, HP, Mana, or range one responsible family at a time.
6. Revisit long-war resolution after performance and economy evidence are both trustworthy.

## LATER — Class Roadmap

1. F — stable foundation
2. E — stable foundation
3. D — stable foundation
4. C — stable foundation
5. B — next class after v3.5 performance and mechanical stabilization
6. A
7. S
8. SS
9. SSS
10. SSS+
11. SSS+ Type I
12. SSS+ Type II
13. SSS+ Type III
14. SSS+ Type IV
15. SSS+ Type V — final

## BLOCKED

- B Class is blocked until the v3.5 performance hotfix and mechanical contract are verified.
- Final balance is blocked on representative export-state results gathered at usable frame rates.
- Future-rank unique abilities remain blocked until their individual roadmap phases.

## DONE

- F, E, D, and C class foundations.
- Commander Forms I Shii-Cho and II Makashi.
- Upgradeable Offense, Defense, Stamina, Luck, and Skill.
- Instant full-state JSON export.
- v3.5 zero-maintenance ranked economy and HP/Mana/range/shielding foundation implemented as a candidate.
- Rejection evidence for v3.4.1 and v3.4.2 preserved.
