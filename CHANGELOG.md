# Changelog

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
