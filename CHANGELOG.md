# Changelog

## Phase 2 v2.21 — Final Pricing Calibration / Command-Recovery Audit

### Patch — Experimental Pricing 15/15 / FINAL SCHEDULED CALIBRATION
- Advanced the scheduled experimental-pricing counter from 14/15 to **15/15**.
- Held F at $10, E at $32, base passive income at $10/s, F bounty at $5, E bounty at $16, and upkeep at 1.60% of living army value/s.
- No fortress, musket, E-charge, command-radius, BREACH-pressure, or company-cap rebalance was stacked onto the final pricing sample.
- Patch 15 completes the planned calibration sequence but does not make the values permanently immutable; later evidence may still justify a change.

### Audit — Final Economy Calibration
- Added four deterministic 600-second deployed-browser economy samples: seeds 22101–22104.
- The highest observed treasury across all eight sampled sides was about **$610.62**; other sampled maxima remained roughly in the $430–$528 range.
- Across the four samples the General AIs made **287 direct E-Class purchases** and soldiers earned **21 F→E promotions**, so the bounded treasuries were not produced by suppressing rank progression.
- All four economy samples preserved finite state, nonnegative treasury, valid fortress HP, the 14-musketeer company cap, and the 15-phase roadmap.
- Final sampled net-income rates remained positive but compressed under army upkeep, ranging from about $0.19/s to $4.46/s in the recorded endpoints rather than returning to the old pre-upkeep runaway behavior.

### Rework Audit — Separated-Commander Soldier Fallback REJECTED
- Tested a proposed cohesion change where a soldier could use a living but company-separated commander as a physical fallback regroup target.
- The controlled regression worked mechanically, but the unchanged three-seed × 600-second natural-siege gate fell to **0 fortress hits**.
- The failed candidate produced heavy rejoin churn: peak rejoining counts reached into the high 30s/low 40s while companies chased commanders that were already returning toward the company.
- Seed 21902 lost the established natural breakthrough and never approached the ~214-unit fortress distance seen in v2.20.
- The fallback was removed instead of weakening the siege acceptance gate or buffing siege combat to compensate.

### Command-Recovery Audit / Accepted Baseline
- Retained the existing simpler behavior: a separated living commander physically returns toward its company, and soldiers use normal local rejoin behavior once company command is functioning again.
- Kept company-integrity radius at 180, individual soldier command radius at 350, rejoin completion at 285, and commander joining speed at 28 units/s.
- Added a deployed regression proving a commander separated by 400 units physically closes the gap by about 28 units in one simulated second while still remaining out of command; precise orders are therefore not restored early and no teleport regroup is introduced.

### Test Infrastructure / Audit Hardening
- Expanded the exact protected Vercel suite from 6 to **8 tests**.
- Added the four-seed final economy-calibration gate.
- Retained the unchanged three-seed natural-siege requirement that at least one natural fortress hit occur across seeds 21901–21903.
- Added peak-uncommanded telemetry to the natural sample instead of claiming cohesion fixed from a single controlled scenario.
- Retained deployed checks for boot/runtime invariants, deterministic 300-second self-play, fieldwork recruitment blocking/reopening, controlled BREACH damage, and Pause/Speed/Front controls.

### Final Deployed Verification — AUTOMATED VERIFIED CANDIDATE
- Verified gameplay commit: `ea1803f262263edf616da3348f152242bfa3c08b`.
- Protected Vercel preview: `trendy-game-kvjdseeow-chclpersonal-9731s-projects.vercel.app`.
- GitHub Actions run `31350330442` passed **8/8** Playwright tests in **55.7 seconds** of browser-test execution.
- Natural seed 21901: 0 fortress hits; final uncommanded 26 / 9.
- Natural seed 21902: Right produced **4 fortress hits**, reached about **214.022** minimum fortress distance, and reduced the upgraded Left fortress from 6500 HP to about **6466.63**.
- Natural seed 21903: 0 fortress hits; final uncommanded 42 / 3.
- Natural sample peak uncommanded counts reached as high as **56**, so high temporary loss of local command remains an open cohesion finding.
- The restored natural-siege telemetry matches the accepted v2.20 deterministic pattern, showing that Patch 15 preserved the proven breakthrough after the failed cohesion experiment was removed.

### Playtesting / Limitations
- Automated deployed playtesting is **PROVEN for the eight tested scenarios**.
- Overall Phase 2 balance/stability remains **PARTIALLY PROVEN**, because a human Vercel playtest has not yet been completed.
- D Class remains blocked until the Phase 2 stability verdict.
- Raw pre-JavaScript `game.html` still carries some legacy v2.19 / Pricing 13 copy; runtime JavaScript presents v2.21 correctly. Static-copy cleanup is tracked as a nonfunctional simplification rather than mixed into the verified gameplay commit.

## Phase 2 v2.20 — Siege Baseline Preservation / Development Consolidation

### Experimental Pricing Patch 14/15 — CONTROLLED HOLD
- F remains $10, E remains $32, base passive income remains $10/s, F bounty remains $5, E bounty remains $16, and upkeep remains 1.60% of living army value/s.
- Fortress HP/damage, musket damage, E charge balance, 30-second base reload, command radii, and BREACH combat constants are unchanged from the verified v2.19 baseline.
- Patch 14 deliberately isolates process/logistics evaluation rather than changing multiple balance variables at once.

### Rework Audit — Forward Fieldwork Muster REJECTED
- Tested a proposed change that moved paid musketeers from fortress deployment to forward fieldwork staging.
- A 55-unit-behind-fieldwork candidate reduced the unchanged three-seed × 600-second natural-siege acceptance sample to zero fortress hits.
- A second 150-unit-behind-fieldwork candidate also produced zero fortress hits.
- The 150-unit run recorded zero emergency-reserve purchases in all three seeds, proving the experimental reserve mechanic was not responsible for the siege regression.
- Seed 21902 degraded from the verified v2.19 minimum fortress distance of about 214.022 to about 677.990 in the 150-unit experiment.
- The forward-muster concept and its emergency-reserve companion were therefore removed rather than compensating with arbitrary attacker buffs.

### Siege Logistics Clarification
- Fieldworks are now documented consistently with the actual accepted mechanic: they are paid-recruitment logistics-control nodes, not forward troop spawn points.
- A viable enemy BREACH within 205 world units of a fieldwork still blocks that side’s paid musketeer recruitment.
- Pushing the BREACH back immediately reopens recruitment.
- Paid musketeers continue to deploy physically from the fortress, preserving the v2.19 siege-conversion baseline.
- Free replacement-command deployment remains unchanged.

### Repository / Workflow Rework
- Created `agent/current` as the single rolling development branch from v2.20 onward.
- Closed version-specific PRs #1–#3 as superseded and opened rolling draft PR #4 against `main`.
- Changed deployed Playwright CI so active development runs only from `agent/current`; legacy `update/v2.17`, `update/v2.18`, and `update/v2.19` refs no longer drive development CI.
- Replaced the placeholder README with current state, invariants, branch policy, verification policy, and the full 15-phase roadmap.
- Updated the Playwright package version to 2.20.0.

### Test / Audit Hardening
- Kept the natural-siege acceptance gate unchanged while evaluating the failed forward-muster experiment; the gate was not weakened to obtain a green build.
- Added an explicit deployed regression that proves contested fieldwork logistics block paid recruitment, relief immediately reopens it, treasury/purchase counts stay unchanged while blocked, and the reopened recruit physically deploys from the fortress.
- Retained exact deployed checks for boot/runtime invariants, deterministic 300-second self-play, three-seed natural siege, controlled BREACH fortress damage, and Pause/Speed/Front controls.

### Final Deployed Verification — VERIFIED CANDIDATE
- Gameplay commit: `eef38d4322c1f3ffe49ab1bb404c04a079156d98`.
- Protected Vercel preview: `trendy-game-jr4pziya9-chclpersonal-9731s-projects.vercel.app`.
- GitHub Actions run `31347815304` passed all **6/6** Playwright tests in **30.8 seconds**.
- Natural seed 21901: 0 fortress hits; all invariants valid.
- Natural seed 21902: Right produced **4 fortress hits**, reached about **214.022** minimum fortress distance, and reduced the upgraded Left fortress from 6500 HP to about **6466.63**.
- Natural seed 21903: 0 fortress hits; all invariants valid.
- Across the natural sample: state remained finite, fortress HP valid, maximum company size stayed at or below 14, and the roadmap remained 15 phases.
- This proves v2.20 preserves the v2.19 natural breakthrough after rejecting the failed reinforcement experiment. It does not yet prove Phase 2 balance is finished; human playtesting remains the final stabilization gate.

## Phase 2 v2.19 — BREACH Logistics / Natural Breakthrough

### Experimental Pricing Patch 13/15 — HOLD
- F remains $10, E remains $32, base passive income remains $10/s, F bounty remains $5, E bounty remains $16, and upkeep remains 1.60% of living army value/s.
- No price, income, bounty, upkeep, fortress-HP, fortress-damage, musket-damage, or E-charge rebalance was used to obtain the breakthrough.

### Bug Fix / BREACH Tactical Rework
- Fixed an unreachable BREACH movement condition: `breachEnemy()` selects threats only within 125 units, while the old advance condition required a selected threat farther than about 160 units.
- Loaded BREACH troops now press to a 92-unit firing line. Reloading F musketeers may keep a slower advance toward 58 units instead of backing away through most of the 30-second reload.
- Once inside fortress range, a BREACH troop prioritizes the fortress unless an enemy is within the 70-unit close-danger zone.
- BREACH companies may use the existing commander-ordered COUNTER-CHARGE against a heavily reloading defender line, then return to BREACH. F melee remains temporary and low-power during CHARGE only; E automatic bayonet behavior is unchanged.
- BREACH commanders follow the company’s actual center during BREACH and BREACH counter-charges so the maneuver does not intentionally separate its own command structure.

### Command / Siege Continuity Bug Fix
- Fixed General decision ordering that could force DEFEND on low global command integrity before the existing committed-BREACH continuation rule was evaluated.
- A viable committed BREACH can now survive wider army-level command disruption as intended; catastrophic home-fortress or army-strength collapse still aborts the assault.
- Retained the 110-second baseline siege commitment. Meaningful new forward progress of at least 12 world units refreshes a 60-second progress grace, preventing a physically advancing spearhead from being cancelled solely because its original timer expired while still allowing a stalled assault to time out.

### Siege Logistics / Reinforcement Rework
- Fieldworks became paid-recruitment logistics-control nodes. When a viable enemy BREACH comes within one musket range (205 world units) of a side’s fieldwork, that side cannot buy new musketeers until the BREACH is pushed back beyond that range.
- Paid musketeers still deploy from the fortress; v2.20 later made this distinction explicit after forward fieldwork spawning failed deployed siege acceptance.
- The block is immediate and reversible; there is no extra cooldown after the fieldwork is relieved.
- Free commander replacement is unaffected, preserving the existing command-recovery system.

### Test Infrastructure / Telemetry
- Added BREACH reload-pressure, close-danger, progress-grace, best-distance, and fieldwork-muster state to the browser test snapshot.
- Added five-second natural-siege sampling that records minimum BREACH-to-fortress distance, assignment survival, command integrity, and whether a spearhead was lost to under-strength, commander death, commander separation, or General abort/reassignment.
- Added a direct deployed-browser regression proving that a contested fieldwork blocks paid musketeer recruitment and that recruitment reopens immediately after the fieldwork is relieved.

### Verification / Process Efficiency
- The deployed Playwright gate samples three deterministic 600-second natural wars and requires at least one natural fortress hit while preserving all invariants; the acceptance condition was not weakened during debugging.
- Reduced Vercel deployment polling from a possible 6 minutes to at most 60 seconds before branch-alias fallback.
- Reduced the Actions job timeout from 20 minutes to 10 minutes, removed deterministic retries, added per-branch concurrency cancellation, and prevented documentation-only pushes from launching browser CI.
- Continue using one batched functional commit per candidate whenever possible.

### Audit
- Exact protected Vercel run for commit `52be450905fa7156868050ad5d042f08c77705ba` passed all 5 browser tests before final documentation/test cleanup.
- In natural seed 21902, the Right BREACH reached a minimum of about 214.022 world units from the Left fortress and produced 4 natural fortress hits, reducing the upgraded fortress from 6500 HP to about 6466.63 HP.
- Seeds 21901 and 21903 produced zero fortress hits, so the result proves natural siege conversion is possible without showing that fortresses have become trivial or that Phase 2 balance is finished.
- All sampled natural runs preserved finite state, valid fortress HP, the 14-musketeer company cap, and the 15-phase roadmap.
- Human Vercel playtesting remains required before Phase 2 is declared stable.

## Phase 2 v2.18 — Persistent BREACH / Command Radius Tune

### Experimental Pricing Patch 12/15
- Hold: F $10, E $32, base passive income $10/s, F bounty $5, E bounty $16, upkeep 1.60% of living army value/s.

### AI / Siege Rework
- Increased the committed siege window from 85s to 110s so a physical assault has more time to cross the 3× battlefield under combat pressure.
- BREACH assignment is persistent while the designated company remains viable instead of being recomputed every command cycle.
- BREACH companies ignore distant rear distractions; screening companies handle those threats. An immediate rear threat within 82 units still forces a turn.
- A committed siege can survive wider command disruption while the designated BREACH company still has enough troops and a living commander. A separated commander still has to physically restore command before the assault resumes.
- Added breach-assignment telemetry.

### Cohesion / Command Tune
- Increased individual soldier local command radius from 320 to 350 world units.
- Increased rejoin completion threshold from 260 to 285 units, preserving hysteresis while reducing excessive detached troops observed in v2.17.
- Command remains local; this is a modest range tune rather than global command.

### Test Infrastructure
- Added `GameTest.forceBreach(team, companyId)` for repeatable fortress-assault scenarios.
- Added `GameTest.sampleSeeds(seeds, seconds)` for repeatable multi-seed self-play sampling.

### Deployment Infrastructure
- Added Vercel root routing so the deployed preview opens the game at `/` instead of requiring `/game.html`.

### Automated Browser Playtesting
- Added Playwright 1.59.1 as the deployed-browser test runner.
- Added GitHub Actions automation that waits for the matching Vercel preview, authenticates through Vercel Protection Bypass for Automation, and then tests the deployed page rather than a local HTML substitute.
- Added deployed smoke/invariant checks, a deterministic 300-second browser self-play test, forced BREACH-to-fortress regression, and player-facing Pause/Resume/Speed/Front control checks.
- Playwright retains traces, failure screenshots, failure video, reports, and deterministic state attachments as GitHub Actions artifacts for later inspection.

### Audit
- All JavaScript files pass `node --check` after the v2.18 edits.
- Three deterministic 300-second runs remain finite, preserve the 14-musketeer company cap, and preserve the 15-phase roadmap.
- A soldier 335 units from its commander is locally commanded in v2.18, proving the 350-unit range tune.
- Persistent BREACH assignment survives temporary commander separation without switching companies.
- A distant rear distraction leaves a BREACH company on BREACH; an immediate rear threat correctly forces TURN.
- Forced BREACH produced 8 fortress hits and reduced the target fortress from 4500 HP to about 4437 HP.
- The 30-second reload, F→E promotion at 4 XP, +20 HP earned-XP heal, and canonical Form I–VII list all regress correctly.
- Natural siege-to-fortress conversion still produced zero fortress hits in the sampled runs, so it is still not claimed solved.

## Phase 2 v2.17 — Cohesion Rejoin / Committed Siege

### Experimental Pricing Patch 11/15
- Hold: F $10, E $32, base passive income $10/s, F bounty $5, E bounty $16, upkeep 1.60% of living army value/s.

### AI / Siege Rework
- Added an 85-second committed siege window once a viable siege starts.
- Added a BREACH role for the most forward viable commanded company while other companies screen defenders.
- BREACH troops prioritize nearby threats but otherwise keep physical pressure toward the enemy fortress.
- Added siege-time telemetry.

### Cohesion / Command Rework
- Locally uncommanded stragglers physically march back toward a functioning company commander when no immediate threat blocks them.
- Added a 260-unit rejoin completion threshold beneath the 320-unit local command radius to avoid boundary oscillation.
- Added troop-rejoin telemetry.

### Bug Fix
- Fixed the first rejoin implementation moving a straggler toward its commander in X while still moving toward its old formation slot in Y. Rejoin movement now converges physically on the commander in both axes.

### Test Infrastructure
- Added a permanent `window.GameTest` API for deterministic stepping, seed control, forced reload/stance/commander-death/fortress-damage scenarios, snapshots, and invariant validation.

### Repository Packaging
- Split the browser game into `game.html`, `styles.css`, and ten ordered JavaScript source chunks to make GitHub edits and audits manageable without changing the game's intended scope.

### Audit
- Combined JavaScript syntax passes.
- Three 300-second deterministic runs remain finite and respect the 14-musketeer company cap.
- Forced physical rejoin passes.
- Forced fortress breakthrough can produce fortress damage.
- Natural siege-to-fortress conversion remains unproven in the sampled 300-second runs and is not claimed fixed.
