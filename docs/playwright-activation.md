# Playwright Deployment Playtest Gate

Status: ACTIVE and verified on `update/v2.18`.

## Classification

- Test infrastructure
- Deployment infrastructure
- Audit / regression gate
- Test-harness bug fix

## Verified pipeline

1. A push to an `update/**` branch triggers Vercel Preview deployment and the `Playwright Vercel Playtest` GitHub Actions workflow.
2. The workflow resolves the successful Vercel deployment associated with the exact Git commit SHA.
3. Chromium runs against that protected deployed URL using the repository secret `VERCEL_AUTOMATION_BYPASS_SECRET` via Vercel's automation-bypass header.
4. The suite verifies boot/invariants, deterministic 300-second browser self-play, a controlled BREACH-to-fortress regression, and player-facing controls.
5. Playwright evidence is uploaded as a GitHub Actions artifact.

## Activation evidence

Successful run: `31340416511`

Commit: `b8e02b3876f01a24525c1b857a87ae45bc0d6a20`

Target used by the successful run: `https://trendy-game-o0z1ws07r-chclpersonal-9731s-projects.vercel.app`

Result: 4/4 Playwright tests passed in 10.9 seconds.

- Deployed preview boot/core invariants: PASS
- 300-second deterministic browser self-play: PASS
- Controlled BREACH fortress damage: PASS
- Pause/Resume/Speed/Front controls: PASS

Artifact: `playwright-evidence-31340416511` (ID `9045651082`), retained for 14 days by the workflow.

## Regression discovered during activation

Run `31340281347` initially failed only the forced-BREACH test. Its captured screenshot/trace showed the test had placed the attacking company beside an intact defender line, so it did not actually establish the clear breakthrough condition the assertion assumed. The harness was corrected by adding an explicit test-only `clearLane` option to `GameTest.forceBreach`; default gameplay behavior remains unchanged. The corrected deployed test then passed.

## Scope boundary

This gate proves the deployed build can boot, preserve core invariants, execute deterministic simulation, perform a controlled fortress breakthrough, and respond to basic controls in a real Playwright Chromium session. It does **not** prove that natural siege-to-fortress conversion is solved. Natural siege remains a Phase 2 investigation target.
