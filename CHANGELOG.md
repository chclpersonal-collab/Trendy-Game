# Changelog

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
- Fieldworks now act as physical muster points. When a viable enemy BREACH comes within one musket range (205 world units) of a side’s fieldwork, that side cannot buy new musketeers until the BREACH is pushed back beyond that range.
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
- BREACH assignment is now persistent while the designated company remains viable instead of being recomputed every command cycle.
- BREACH companies ignore distant rear distractions; screening companies handle those threats. An immediate rear threat within 82 units still forces a turn.
- A committed siege can survive wider command disruption while the designated BREACH company still has enough troops and a living commander. A separated commander still has to physically restore command before the assault resumes.
- Added breach-assignment telemetry to the internal state for testing.

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
