# Changelog

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
