# Changelog

## Phase 3 v3.1.1 — Command Continuity / Coordinated Withdrawal

### Bug Fix — Commander Retreat No Longer Equals Command Loss
- Separated **morale/command authority** from tight commander/company proximity.
- An original living commander remains the company's active authority while alive, even when temporarily outside the 180-unit tight-cohesion radius.
- Soldiers therefore no longer become panicked/uncommanded merely because a living commander is regrouping or withdrawing.
- This is not global tactical command: the established **350-unit individual soldier tactical radius** remains intact.
- Outside local tactical range, soldiers retain morale authority but use coherent regroup/self-defense behavior instead of receiving detailed remote orders.
- Added separate `commandProximityIntegrity` telemetry so 180-unit spacing can still be audited without conflating it with commander death.

### Bug Fix / Command Rework — Commander Death Is the Real Disruption Event
- Commander death removes the company's active command source and can produce genuine uncommanded/panic behavior.
- Replacement commanders remain physical units.
- A replacement does not restore authority merely because it spawned; it must physically reach the company and set `joinedCommand=true`.
- BREACH viability now requires both at least 6 living company musketeers and an active command source, preventing an unjoined replacement from restoring siege authority early.

### Bug Fix — Coordinated Withdrawal
- `RALLY` and rearward `DEFEND` now move the commander and soldiers as a company instead of allowing the commander to retreat alone.
- During withdrawal, commander guard/combat distractions are suppressed and the commander stays referenced to the company center.
- Soldiers under RALLY/REGROUP do not start fresh autonomous E/D bayonet charges while withdrawing.
- Living-command authority remains intact throughout the coordinated withdrawal.

### Visual / Movement Bug Fix — No Retreat Moonwalking
- Backward-moving soldiers and commanders now face their actual movement direction.
- Applied to RALLY, rearward DEFEND, panic retreat, disarm retreat, close-range fallback, and commander withdrawal.
- The renderer uses actor `facing` for musket, bayonet, saber, muzzle flash, and melee orientation, so the change is visible on-screen rather than telemetry-only.

### Bug Fix — Adaptive Rebuild Thresholds
- v3.1's 2–14 soldier company system still used the old fixed `4 men = rebuild / 8 men = recovered` thresholds.
- This could trap a deliberately chosen 2–4 soldier company in RALLY even when fully staffed.
- Rebuild thresholds now scale with the commander's chosen target size.
- Verified examples: target 2 → low 1 / ready 2; target 14 → low 4 / ready 8.
- The old large-company behavior is therefore preserved while small companies can correctly finish rebuilding.

### Audit / UI — Siege-Blocked Emergency Recovery
- The four-seed economy audit still contains a high-cash wiped-army observation: seed 32103 reached about **$2,304.97** and ended with 0 Left musketeers.
- Recovery logic was audited rather than immediately rebalancing income.
- When an army has fewer than 7 musketeers and paid recruitment is blocked by a viable enemy BREACH, the General now reports **`MUSTER BLOCKED`** instead of misleadingly reporting `RECOVER F`.
- Once the enemy BREACH is relieved, emergency F recruitment resumes normally.
- A dedicated deployed regression reproduces a 0-soldier / $2,305 defender under a viable six-man enemy BREACH, verifies `MUSTER BLOCKED`, relieves the siege, and verifies immediate `RECOVER F` recruitment of 3 soldiers.
- The established fieldwork logistics blockade was not weakened.

### Test Fix — MUSTER BLOCKED Scenario Setup
- Run `31358114685` passed **19/20** tests.
- The sole failure was the newly added MUSTER BLOCKED test omitting the explicit six-man company target used by the established fieldwork/BREACH regression.
- The existing fieldwork block/reopen test passed in that same run, proving the blockade itself remained functional.
- The explanatory test was corrected to set `targetSize=6`; no gameplay workaround was introduced.

### Final Deployed Verification — AUTOMATED VERIFIED CANDIDATE
- Exact verified deployed HEAD: `d79cbcf36fadd375125b8c5b0ad30f3117fe3dc6`.
- Protected Vercel preview: `trendy-game-k8cush2ly-chclpersonal-9731s-projects.vercel.app`.
- GitHub Actions run **`31358519582` passed 20/20 Playwright tests** in about **4.2 minutes**.
- Evidence artifact ID: **`9051555549`**.
- New direct regressions verify living-commander separation vs commander death, coordinated RALLY withdrawal, visible retreat facing, physical replacement joining, adaptive rebuild thresholds, and MUSTER BLOCKED → RECOVER F after relief.
- The prior v3.1 zero-start, 150-cap, adaptive-company, D progression, economy, fieldwork, BREACH, and UI regressions also remain green.

### Economy Audit — 4 × 600 Seconds
- Seeds 32101–32104 all remained finite and valid.
- Peak living army was **66** musketeers; peak company count remained **11**.
- Maximum sampled D share was about **6.45%**.
- Highest sampled treasury remained about **$2,304.97** in seed 32103, which ended at 0 / 32 living musketeers and Left E fortress HP about **6257.57 / 6500**.
- The high treasury remains a recorded operational/balance observation; the dedicated blockade test proves one legitimate rich-but-unable-to-recruit mechanism and immediate recovery after relief.

### Siege Stabilization Audit — Same 9 × 900-Second Seeds
- Replayed the same seeds 32201–32209 used in the v3.1 warning sample.
- All nine preserved technical invariants, the 150-musketeer cap, and 11-company cap.
- Only **seed 32207** produced fortress damage: Left made **2 hits**, reached about **214.155** minimum BREACH distance, and reduced the Right E fortress from 6500 to about **6486.27 HP**.
- The other eight seeds produced zero fortress hits.
- v3.1 had produced **123 combined hits** in this same nine-seed suite, including the 117-hit seed 32206; v3.1.1 produced **2 total hits**.
- The 117-hit sustained-BREACH warning therefore did **not reproduce**, while natural fortress conversion remains possible.

### Roadmap
- F Class — STABLE.
- E Class — STABLE.
- D Class — **NOW: v3.1.1 automated verified candidate**.
- Form I Shii-Cho — STABLE.
- **Form II Makashi** returns as the leading next Phase-3 commander-form candidate now that the previous 117-hit siege outlier no longer reproduces.
- C Class — NEXT CLASS, still locked until the next isolated commander-form slice is verified.
- Continue tracking siege-blocked treasury accumulation without weakening the fieldwork logistics system.

## Phase 3 v3.1 — Adaptive Company Cohesion

### Major / Command Rework — Commander-Chosen 2–14 Soldier Companies
- Commanders now choose a **target company load from 2–14 musketeers** instead of treating 14 as the default working size.
- Mission posture biases the choice: **BUILD 2–6, DEFEND 4–8, CONTEST 5–10, ATTACK 8–12, SIEGE 10–14**.
- High upkeep pressure pushes new commanders toward smaller targets.
- Runtime doctrine labels are **LEAN** (2–5), **BALANCED** (6–10), and **MASS** (11–14).
- The hard maximum remains 14 living musketeers per company.

### AI / Structural Rework — Preserve the 150-Soldier Ceiling
- Added an **11-company maximum per army**, matching `ceil(150 / 14)`.
- Recruitment fills each command only to its chosen target before opening another company while commander slots remain.
- If all 11 company slots are occupied and the General still needs soldiers, existing commanders may expand target load by one at a time up to 14.
- Expansion favors active BREACH/SIEGE/CHARGE/ADVANCE commands and already-larger companies.
- This prevents unlimited commander spam from tiny companies while preserving a real path to the 150-musketeer hard ceiling.

### Cohesion Rework — Smaller Is Tighter, Larger Is Heavier
- Cohesion scales continuously with current living company load from **1.22 at 2 soldiers** to **0.84 at 14 soldiers**.
- Smaller companies begin longitudinal cohesion correction at tighter spacing, reform vertically faster, receive shorter commander decision intervals, and synchronize formal volleys faster.
- Larger companies sacrifice some coordination for more simultaneous musket mass and greater attrition depth.
- Existing threshold mechanics create additional large-company advantages: formal volleys require at least 4 ready musketeers, counter-charge evaluation requires at least 5 company musketeers, and BREACH viability requires at least 6.
- No raw musket damage, generic accuracy, global reload, or rank-stat bonus was added to small companies.

### Audit / Validation Hardening
- Runtime state exposes company target size, doctrine, cohesion factor, cohesion spacing threshold, formation speed, decision scale, volley synchronization time, and target-size expansion count.
- `GameTest.validate()` rejects company target sizes outside 2–14 and armies exceeding 11 companies, in addition to the 14-per-company and 150-per-army checks.
- Test API exposes the company sizing/cohesion functions for direct tradeoff verification.
- Package version advanced to **3.1.0**.

### Final Deployed Verification — AUTOMATED VERIFIED CANDIDATE
- Verified gameplay HEAD: `b207d8ff686a14e736a5a8f868984272187b6348`.
- Protected Vercel preview: `trendy-game-m98ojans8-chclpersonal-9731s-projects.vercel.app`.
- GitHub Actions run **`31355086417` passed 14/14 Playwright tests** in about **5.1 minutes**.
- Evidence artifact ID: `9050434042`.

### Adaptive-Company Economy Audit — 4 × 600 Seconds
- Seeds 32101–32104 preserved technical invariants.
- Peak living army size was **59 musketeers** and peak company count reached **11**.
- Maximum sampled D share was about **5.56%**.
- Highest sampled treasury was about **$1,474.37** in seed 32103.

### Adaptive-Company Natural Siege Audit — 9 × 900 Seconds
- Seeds 32201–32209 preserved technical invariants.
- Seed 32205 produced 6 Right fortress hits.
- Seed 32206 produced **117 Left fortress hits** and became the sustained-BREACH balance warning that motivated the v3.1.1 stabilization work.
- The other seven seeds produced zero fortress hits.

## Phase 3 v3.0 — D-Class Foundation / Assault Drill

### Major Rework — Zero-Start Armies / 150-Soldier Ceiling
- Every new war begins with **0 musketeers per army** instead of 14 free F musketeers.
- Each General retains its starting treasury and must build the army through actual purchases.
- The hard musketeer ceiling is **150 per army**, allowing up to **150 vs 150** musketeers.
- Commanders are separate from the 150-musketeer count.
- 150 is a hard ceiling, not an AI target.

### Bug Fix — True Army-Wide Cap Enforcement
- Fixed `companyWithRoom()` so the army-wide cap is checked before spare company capacity.
- The 151st musketeer is rejected even if a company still has a spare slot.

### Automated Verification — Zero Start / 150 Cap
- Verified deployed HEAD: `60ade9918a183e8887f51fd394149eb0a254901f`.
- GitHub Actions run `31353827658` passed **13/13** Playwright tests.
- Fresh reset state is 0 / 0 musketeers with one initial commander/company structure per side.

### Major Update — D Class
- D may be bought directly for **$80** or earned from E at **10 total XP**.
- D kill bounty is **$40** under the existing 50% defeated-rank-price rule.
- D inherits E's bayonet charge.
- D Assault Drill activates only under SIEGE, BREACH, or commander CHARGE and gives +3.5 percentage points aim, a 2-second reload bonus, and 25-second D reload floor.
- Outside assault orders D uses an E-equivalent veteran combat baseline.

### Bug Fix — Preserve Phase-2 F/E Economy
- Rejected normalization across the raw F→D price span because it reduced E's established contribution.
- F price-quality contribution remains 0, E remains 1, D is bounded at 1.5; full D price still counts toward upkeep.

### Earlier v3.0 Candidate Evidence
- Universal passive D designs were rejected after deployed testing showed natural siege suppression.
- The accepted Assault Drill design kept D's advantage assault-dependent instead of universally buffing defensive lines.

## Phase 2 v2.21 — Final Pricing Calibration / Command-Recovery Audit

### Patch — Experimental Pricing 15/15
- Completed the scheduled pricing calibration at F $10, E $32, $10/s passive income, 50% bounty, and 1.60% living-army-value upkeep.

### Audit — Final Economy Calibration
- Four deterministic 600-second deployed-browser economy samples peaked at about $610.62 while retaining direct E purchases and earned F→E promotion.
- Exact run `31350330442` passed **8/8** Playwright tests.
- Natural seed 21902 produced 4 fortress hits at about 214.022 minimum fortress distance.

### Rework Audit — Separated-Commander Soldier Fallback REJECTED
- A proposed soldier fallback toward a separated living commander worked mechanically but erased natural fortress hits and caused heavy rejoin churn.
- The fallback was removed rather than weakening the siege gate.
