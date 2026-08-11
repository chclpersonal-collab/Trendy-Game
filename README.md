# Musketeer Battle Simulator

Autonomous two-army musketeer battle simulation developed on the rolling `agent/current` branch. Completion claims are evidence-gated by deployed Vercel/Playwright runs. Failed candidates remain recorded and are reverted when they regress protected behavior.

## Current state

- F Class — **STABLE**
- E Class — **STABLE**
- D Class — **STABLE**
- C Class v3.3 / Volley Drill — **STABLE / accepted**
- Current development — **v3.4 Army Training / Siege Resolution / Instant State Export**
- Status — **PARTIAL CHECKPOINT / NOT YET A RELEASE**
- Active branch HEAD — `f1be4fc82c653bf9cd98ef03a9ccd4127a031ba1`
- Active file tree is identical to the safer pre-experiment checkpoint `fa7b2729c964da04cf3745c85f5188addb12fc2f`; exact gameplay/test files match candidate `2d1038a96d551e5131f58649750ca50b562e2390`.
- Re-verification run after the explicit revert — `31480124358` (**in progress at checkpoint time**).
- B Class remains deferred until v3.4 is technically resolved.

## Correction: display-only stats rejected

The old v3.3.1 interpretation of Offense / Defense / Stamina / Luck / Skill as read-only telemetry was rejected. The active game uses **upgradeable gameplay statistics**:

- **Offense** increases outgoing damage.
- **Defense** reduces incoming damage.
- **Stamina** reduces musket reload time.
- **Luck** adds a bounded real critical-hit chance.
- **Skill** increases musket accuracy.

All five begin at **Level 1**, the pre-v3.4 baseline, so the system does not silently buff everyone merely by existing.

Current candidate values:

- level cap **20**
- first upgrade **$80**, then **+$25** per purchased level
- AI training cooldown **35s**
- AI training begins only after **900s of the current war**, preserving early rank ecology
- Offense **+2.5% damage/level above 1**, capped +35%
- Defense **-1.5% incoming damage/level above 1**, capped 25%
- Stamina **-0.45s reload/level above 1**, absolute 22s floor
- Skill **+0.6 percentage points accuracy/level above 1**, capped +8pp
- Luck **+0.7% critical chance/level above 1**, capped 12%; critical hit = 1.5× damage

Controlled deployed-browser tests prove the five purchased stats change their intended mechanics. Their autonomous long-run balance remains under investigation.

## Instant diagnostic export

The top bar includes **Export State**. It can be clicked **at any moment**, including immediately at `t=0`; no win, bug, special event or waiting period is required.

The browser downloads:

`musketeer-state-v3.4.0-seed-<seed>-war-<war>-t-<seconds>s.json`

Upload that JSON instead of repeatedly taking screenshots. It contains:

- exact seed and RNG state
- simulation time, war number, war age and winner state
- front position and velocity
- General strategies, budgets, reserves and training history
- every company and command state
- every troop/commander with rank, HP, XP, reload, position, facing, panic, charge and rejoin state
- fortresses, fortress hits, positions and siege/BREACH state
- anomaly flags including an unresolved war past 1800s
- a rolling 10-second flight recorder

The deployed-browser download regression has passed at `t=0`.

## 2000-second no-win investigation

The reported >2000-second unresolved war is a blocking gameplay problem. Fortress maximum HP remains unchanged: **F 4500 / E 6500**. Ordinary fortress fire remains **6–10** damage. The current v3.4 candidate gives organized SIEGE fire **32–48** and BREACH fire **70–95**, but stronger fortress damage is irrelevant when the spearhead never reaches fortress range.

Protected acceptance gate:

- seeds `32201`, `32206`, `32207`
- observe the first war to **2200 simulated seconds**
- at least **2/3 must actually resolve**
- at least one must resolve by **2000s**
- fortress damage alone is not a win
- all finite, rank, fortress, company and army-cap invariants must stay green
- at least one natural long run must perform autonomous stat training after 900s

### Exact v3.4 result before this checkpoint

Run `31461105512`: **37/38 passed**.

- seed `32206` resolved around **1490s**
- seeds `32201` and `32207` did not resolve by 2200s
- strict result: **1/3**, therefore rejected as a release
- artifact `9089913074`
- SHA256 `42d65174e531c9f89c96168be9110f19379540958b5afb1e1dc19edce8cc0eac`

Its trace showed severe late-war command fragmentation: at 2199s, **13 of 21 companies were on RALLY**, plus one JOINING company. That was evidence for an experiment, not proof that consolidation was the correct solution.

## Rejected v3.4.1 experiment — Understrength Company Reform

Candidate commits `924eb4e624b03efd16ee20074d906fa9bd5e7c6b` through `fbd8a2c2e35e51c00147485856eb7ed9f9c60c9e` attempted to:

- prioritize rebuilding companies for reinforcement
- transfer existing soldiers between chronically understrength companies
- place emptied commands in reserve and reuse them later

Focused tests proved those mechanics preserved troop count, rank and slot validity. The protected deployed suite nevertheless rejected the candidate.

Run `31479352271`: **38/40 passed, 2 failed**.

- both focused company-reform tests passed
- rank ecology and C ecology passed
- economy/cap/finite-value validation passed
- **all three 2200s wars remained unresolved**
- **all nine protected 900s natural-siege seeds produced zero fortress hits**
- reform therefore disrupted forward pressure and removed the previously reproducible seed-32206 fortress conversion
- artifact `9096731522`
- SHA256 `982edae1f7316270504bfe1de42019d26a279858d4bdfafa64df55bd760c4b5f`

The experiment was explicitly reverted by commit `f1be4fc82c653bf9cd98ef03a9ccd4127a031ba1`. The active branch contains no v3.4.1 gameplay or tests.

## Current diagnosis

The evidence now rules out two blind approaches:

1. **More fortress damage alone** does not help armies that never enter fortress range.
2. **Moving existing soldiers between companies during a live war** damages forward continuity and siege conversion.

The next smallest candidate should target **BREACH spearhead continuity and reinforcement**, not global company consolidation. High `breachAssignments` counts show repeated spearhead replacement; recruitment currently does not specifically reinforce the active BREACH company.

## Core invariants

- new war starts with **0 musketeers/side**
- maximum **150 musketeers/army**; commanders are separate
- **2–14** target soldiers/company, hard maximum **14**, maximum **11 companies/army**
- F/E/D/C prices **$10 / $32 / $80 / $150**
- passive income **$10/s**, bounty **50%**, upkeep **1.60% of living army value/s**
- base musket reload **30s**
- F→E **4 XP**, E→D **10 XP**, D→C **18 XP**
- each earned XP restores **20 HP**, capped at full HP
- E autonomous bayonet, D Assault Drill and C formal Volley Drill remain preserved
- local command radius **350**, tight company proximity **180**, rejoin completion **285**
- replacement commanders must physically join
- fieldwork remains a logistics gate, never a forward spawn
- Commander Forms I Shii-Cho and II Makashi remain unlocked; no projectile deflection
- the 15-phase class roadmap remains intact

## Roadmap

1. F — **STABLE**
2. E — **STABLE**
3. D — **STABLE**
4. C — **STABLE**
5. B — **NEXT CLASS only after v3.4 stabilization**
6. A
7. S
8. SS
9. SSS
10. SSS+
11. SSS+ Type I
12. SSS+ Type II
13. SSS+ Type III
14. SSS+ Type IV
15. SSS+ Type V

Near term:

- **NOW:** isolate BREACH spearhead churn and test reinforcement priority without reassigning existing soldiers
- **NEXT:** stabilize v3.4 and pass the strict 2/3 long-war resolution gate
- **THEN:** B Class as its own isolated soldier-rank update
- **LATER:** Form III Soresu, isolated from B Class

## Verification policy

- A passing focused test does not override a failed protected ecology/siege gate.
- Failed candidates remain failed and documented.
- Tests are not weakened to manufacture a release.
- Deployed-browser evidence proves only the scenarios actually exercised.
- No-comments acceptance applies only after a technically verified update is delivered.