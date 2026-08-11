# Musketeer Battle Simulator

Autonomous two-army musketeer battle simulation developed on the rolling `agent/current` branch. Completion claims are evidence-gated by deployed Vercel/Playwright runs. Failed candidates remain recorded rather than being relabeled as successful.

## Current state

- F Class — **STABLE**
- E Class — **STABLE**
- D Class — **STABLE**
- C Class v3.3 / Volley Drill — **STABLE / accepted**
- Current development — **v3.4 Army Training / Siege Resolution / Instant State Export**
- Status — **VERIFICATION IN PROGRESS / NOT YET A RELEASE**
- Current branch HEAD under verification — `2d1038a96d551e5131f58649750ca50b562e2390`
- Current protected run — `31461105512`
- B Class remains deferred until v3.4 is technically resolved.

## Correction: v3.3.1 rejected

The previous v3.3.1 implementation interpreted Offense / Defense / Stamina / Luck / Skill as display-only derived force factors. That interpretation was rejected by the user. The display-only implementation has been removed from the active game and must not be treated as accepted design precedent.

The intended design is **upgradeable gameplay statistics**, not decorative telemetry.

## v3.4 — Upgradeable army training

Each General now owns persistent army-training levels for the current run:

- **Offense** — increases outgoing combat damage.
- **Defense** — reduces incoming combat damage.
- **Stamina** — reduces musket reload time.
- **Luck** — adds a bounded real critical-hit chance.
- **Skill** — increases musket accuracy.

All five start at **Level 1**, which is the pre-v3.4 gameplay baseline. Level 1 therefore adds no hidden universal buff.

Current tuning candidate:

- maximum level: **20**
- first upgrade: **$80**
- each later purchased training level costs **+$25** over the previous upgrade cost
- AI training cooldown: **35 seconds**
- AI training is blocked during the first **900 seconds of a war** so rank procurement/ecology gets priority
- training spends real treasury and must preserve the General's reserve and surplus buffer
- Offense: **+2.5% damage / level above 1**, capped at +35%
- Defense: **-1.5% incoming damage / level above 1**, capped at 25%
- Stamina: **-0.45s reload / level above 1**, absolute 22s floor
- Skill: **+0.6 percentage points accuracy / level above 1**, capped at +8pp
- Luck: **+0.7% critical-hit chance / level above 1**, capped at 12%; critical hit = 1.5× damage

Controlled deployed-browser evidence already proves that paid levels change the intended mechanics. Autonomous long-run purchase behavior remains part of the current endurance gate.

## Instant diagnostic export — use this instead of screenshots

The top control bar now includes **Export State**.

**At any point in the game, click `Export State`. You do not need to wait for a special event, a win, a bug, or a certain simulation time.**

The browser immediately downloads a file named approximately:

`musketeer-state-v3.4.0-seed-<seed>-war-<war>-t-<seconds>s.json`

Upload that JSON file to ChatGPT when reporting anything unusual. It contains substantially more diagnostic information than a screenshot:

- exact run seed and current RNG state
- current simulation time, war number and war age
- winner state
- front position and velocity
- full General AI state
- strategies, budgets and reserves
- all five training levels, spend and upgrade history
- all companies and command states
- complete current actor/soldier/commander state
- ranks, HP, reload, XP, facing, panic, rejoin and charge state
- fortresses and fortress hits
- contested positions
- siege/breach state
- anomaly flags such as a >1800s unresolved war
- a rolling flight recorder sampled every 10 simulated seconds

The browser-download regression has passed on deployed Vercel at **t=0**, proving the export is immediately available rather than requiring a long play session.

## 2000-second no-win investigation

The reported >2000-second unresolved war is treated as a real pacing/AI problem, not something to hide behind passing short tests.

### What has been disproved

Simply increasing fortress damage is **not sufficient**. The first v3.4 long-war candidate showed repeated siege pushes while spearheads still failed to convert them into first-war wins.

### Current siege candidate

- Fortress maximum HP is unchanged: **F 4500 / E 6500**.
- Ordinary fortress-fire damage remains **6–10**.
- Commander-organized SIEGE fire candidate: **32–48**.
- BREACH fire candidate: **70–95**.
- Mature rational sieges can retain a longer commitment, but normal General strategy may still abort to DEFEND / CONTEST.

The current long-war audit uses the same **5-second external stepping cadence** as the established 900-second natural-siege audit after a 25-second stepping variant proved non-comparable for long deterministic trajectories.

The acceptance gate is intentionally stronger than the old 'fortress damage can happen' test:

- seeds `32201`, `32206`, `32207`
- first war observed up to **2200 simulated seconds**
- at least **2 of 3 must actually resolve**
- at least one must resolve by **2000 seconds**
- all finite/cap/rank/fortress invariants must remain green
- at least one natural long run must demonstrate autonomous stat training after the 900-second maturity gate

Until that passes, the long-war fix is **NOT PROVEN**.

## Failed / blocked evidence retained

### First v3.4 candidate — REJECTED

Run `31459186669` — **34/38 passed, 4 failed**.

Important failures:
- early AI training suppressed C-Class ecology
- all three 2200-second first wars remained unresolved
- one stale v3.3 metadata assertion
- the old 900-second natural-siege control was perturbed

Artifact: `9089296483`  
SHA256: `117369cb730d7319cdea83e216acb6c40675d6d30422aca78d0c49ac4b517444`

### Corrected candidate before harness alignment — PARTIAL / NOT VERIFIED

Run `31460159558` reached GitHub's old **10-minute CI timeout** before finishing the full suite.

Before timeout it proved:
- v3.3 C ecology was restored exactly by delaying AI training until 900s
- real stat mechanics passed
- instant Export State download passed
- ordinary vs organized fortress-damage tiers passed
- 4×600 economy remained bounded
- established 9×900 natural-siege behavior returned, including seed `32206` with 27 fortress hits

But its 25-second-chunk long-war test still reported all three wars unresolved, so v3.4 was not accepted.

Artifact: `9089672670`  
SHA256: `5783855d540d19c676610144c38593bbae462dc70d1ca3850ee408253d3eddf7`

The workflow timeout has been raised **10 → 15 minutes** only so the expanded endurance verification can finish; gameplay acceptance thresholds were not changed.

## Core gameplay invariants

- new war starts with **0 musketeers per side**
- maximum **150 musketeers per army**; commanders are separate
- maximum **14 soldiers/company**, **11 companies/army**, adaptive target **2–14**
- F / E / D / C prices: **$10 / $32 / $80 / $150**
- passive income **$10/s**, bounty **50%**, upkeep **1.60% of living army value/s**
- base musket reload **30s**
- F→E **4 XP**, E→D **10 XP**, D→C **18 XP**
- each earned XP restores **20 HP**, capped at full HP
- E autonomous bayonet identity preserved
- D Assault Drill preserved
- C formal Volley Drill preserved
- command authority / local tactical command remain separate
- local tactical-command radius **350**, tight company proximity **180**, rejoin completion **285**
- paid troops still spawn at their fortress; fieldwork remains a logistics gate, not a forward spawn
- Commander Forms I Shii-Cho and II Makashi remain unlocked; no projectile deflection
- 15-phase class roadmap remains intact

## Roadmap

1. F — **STABLE**
2. E — **STABLE**
3. D — **STABLE**
4. C — **STABLE**
5. B — **NEXT CLASS after v3.4 stabilization**
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

- **NOW:** finish v3.4 endurance verification and diagnose any remaining no-win mechanism from the downloadable state/flight-recorder evidence
- **NEXT:** B Class only after v3.4 is technically accepted
- **LATER:** Form III Soresu as an isolated commander-form update
- **MONITOR:** future high-rank ecology so later ranks remain rare but actually present, directly purchasable and earnable

## Verification policy

- A green short test does not override a failed long-war gate.
- A failed candidate remains failed.
- Tests are not weakened to manufacture a release.
- Deployed-browser evidence proves only the scenarios actually exercised.
- No-comments acceptance applies only after a technically verified update is delivered.