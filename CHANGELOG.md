# Changelog

## Phase 3 v3.2.1 — Rank Ecology / Elite Siege Discipline

### Balance Rework — Separate E and D Ecology
- Reworked General procurement so **E and D are independent rank layers** instead of one combined elite-share bucket.
- Intended hierarchy is **F majority / E regular / D rare-visible**.
- E target shares are **18% BUILD, 18% DEFEND, 20% CONTEST, 24% ATTACK, 26% SIEGE**.
- D target shares are **3% BUILD, 3% DEFEND, 4% CONTEST, 5% ATTACK, 6% SIEGE**.
- Non-SIEGE D purchasing requires a mature army of at least **18** musketeers.
- The established funded SIEGE D top-off remains available from **12** musketeers.
- Recovery below 7 musketeers remains F-first.
- This intentionally retires the old v3.0 rule that routine D procurement outside SIEGE is always zero; the change is classified because user playtesting showed D had become practically mythical.

### Preserved Progression / Economy
- F→E remains **4 earned XP**.
- E→D remains **10 total XP**.
- XP healing remains **+20 HP per earned XP**.
- Prices remain **F $10 / E $32 / D $80**.
- Passive income remains **$10/s**.
- Bounty remains **50% of defeated-rank price**.
- Living-army upkeep remains **1.60% of army value/s**.
- D's ordinary combat baseline and Assault Drill values were not buffed.

### Bug Fix / Command Rework — Elite Siege Discipline
- The first ecology candidate exposed an old order conflict: autonomous E/D bayonet initiation is evaluated before BREACH-specific movement.
- With a healthier E/D population, this caused siege spearheads to repeatedly abandon explicit BREACH movement for fresh autonomous charges.
- E/D soldiers under explicit **SIEGE or BREACH** now suppress only the start of a fresh autonomous bayonet charge.
- A charge already in progress may finish.
- Ordinary autonomous E/D bayonet behavior outside SIEGE/BREACH remains unchanged.
- This is consistent with existing BRACE/RALLY command discipline and allows D Assault Drill to function under the siege orders it was designed around.

### Audit — User Rank-Rarity Observation
- User screenshot at about 2027 simulation seconds showed Left **39 troops / 3 E / 0 D** and Right **48 troops / 9 E / 0 D**.
- The observation was classified as **OBSERVED**, not treated as universal balance proof.
- Historical Phase-2 evidence had already identified zero live E despite repeated promotions as too sparse, supporting a rank-presence audit rather than assuming extreme rarity was desirable.

### Rejected Candidate — Run 31378197525
- First v3.2.1 ecology candidate passed the new ecology measurement itself: mean E **15.31%**, mean D **2.80%**, mean combined elite **18.11%**, maximum elite **30%**, D present in **68.75%** of mature samples.
- One UI regression still expected the old `v3.2` badge; this was stale test maintenance, not a gameplay regression.
- More importantly, **all nine protected 900-second natural-siege seeds produced zero fortress hits**.
- Result: **REJECTED / NOT PROVEN**. The natural-siege acceptance condition was not weakened.
- Evidence artifact ID `9058933585`, SHA256 `f77884c2ad34ee7f3be6a7497c4936edb58277bf621162fa7b39aae6a97a648b`.

### Test Maintenance / Implementation Hygiene
- Updated the battle-first UI regression from exact badge `v3.2` to `v3.2.1` after the patch version advanced.
- An early pre-verification `src/11.js` draft contained an invalid metadata assignment; it was corrected immediately before any candidate was accepted. No completion claim was based on that intermediate commit.
- Added direct procurement, siege-discipline, and time-sampled rank-ecology regressions rather than judging class frequency from a single screenshot.

### Final Deployed Verification — AUTOMATED VERIFIED CANDIDATE
- Exact verified gameplay HEAD: `906df2d8d21950396d442deb08046609fbea19e2`.
- Protected Vercel preview: `trendy-game-qpdpbwah9-chclpersonal-9731s-projects.vercel.app`.
- GitHub Actions run **`31378905265` passed 30/30 Playwright tests** in about **5.1 minutes**.
- Evidence artifact ID: **`9059201788`**.
- Evidence artifact SHA256: `0008d9f5eed07d4c82683530a409b94917ab64a6e1ee15a2513816c6d7d01299`.
- The full previous v3.2/frontend/v3.1.1 regression suite remained green.

### Rank Ecology Measurement — 600 Seconds
- Seed `34202` produced **32 mature-army time samples** after the opening 120 seconds.
- Mean E share: **17.53%**.
- Mean D share: **2.96%**.
- Mean combined E+D share: **20.49%**.
- Maximum sampled combined elite share: **30%**.
- D was present in **75%** of mature-army samples.
- Direct purchases: Left **102 F / 32 E / 5 D**, Right **134 F / 36 E / 5 D**.
- The tested hierarchy therefore remained F-majority while making E a meaningful veteran layer and D rare but recurring.

### Economy Audit — 4 × 600 Seconds
- Seeds 32101–32104 all remained finite and valid.
- Peak living army: **57**.
- Peak companies: **11**.
- Highest sampled treasury: about **$603.76**.
- Maximum instantaneous D share observed by this max-only audit: **12%**.
- No negative treasury, invalid rank, fortress bound, army-cap, company-cap, or finite-value failure occurred.

### Natural-Siege Audit — 9 × 900 Seconds
- Seeds 32201–32209 all remained technically valid.
- Peak living army: **71**; peak companies: **11**.
- Seed **32201**: Right produced **4 fortress hits**, minimum Right BREACH distance about **214.104**, Left E fortress **6500 → about 6467.94 HP**.
- Seed **32206**: Right produced **6 fortress hits**, minimum Right BREACH distance about **191.539**, Left F fortress **4500 → about 4449.17 HP**.
- Total fortress hits: **10**; the other seven seeds produced zero hits.
- Natural fortress conversion therefore remains possible and the old v3.1 117-hit sustained-siege outlier did not return in this sample.

### Roadmap
- F Class — STABLE.
- E Class — STABLE.
- D Class foundation — STABLE; v3.2.1 rank ecology is an **AUTOMATED VERIFIED CANDIDATE**.
- **C Class — NEXT CLASS** after v3.2.1 acceptance.
- **Form III Soresu — LATER**, isolated from the C-Class implementation.
- Future ranks must preserve the dual-path buy/earn policy while avoiding exponentially vanishing live presence.

## Phase 3 v3.2 — Form II Makashi + Tactical Combat Continuity

### Minor Update — Form II Makashi
- Unlocked **Form II Makashi** as the second autonomous commander lightsaber form.
- Makashi is the precise **single-target anti-commander duel** form.
- It automatically takes an isolated nearby commander duel when local crowd pressure is low.
- It has stronger single-target commander damage than Form I Shii-Cho.
- When the local fight becomes crowded, the commander returns to **Form I Shii-Cho**, preserving Shii-Cho's crowd role.
- Makashi adds no disarm and no projectile deflection.

### Bug Fix — Cross-Lane Tactical Awareness
- Reproduced the screenshot-reported case before implementation: a horizontally local enemy in another vertical lane could remain unengaged while nearby allies continued in formation.
- Added bounded local cross-lane interception for ordinarily maneuvering companies.
- Interception requires the established local soldier-command relationship rather than granting army-wide awareness.
- Horizontal relevance is capped at **240 units**, total relevance at **310 units**, and vertical movement remains formation-leashed.
- BREACH, SIEGE, CHARGE, BRACE, VOLLEY, RALLY, REGROUP, and active rearward movement are not overridden by this interception behavior.

### Bug Fix — Withdrawal Combat Continuity
- Loaded musketeers can now fire while continuing coordinated RALLY/rearward movement.
- Withdrawing commanders retain danger-close self-defense while staying with their company.
- E/D musketeers may use contact bayonet self-defense during a threatened withdrawal.
- F soldiers do **not** receive generic melee capability from this fix.
- Existing panic/disarm behavior remains separate and unchanged.
- v3.1.1 movement-facing behavior remains intact, so units still face the direction they are actually moving.

### Audit — Reproduction Before Fix
- Three focused regressions were added before the gameplay implementation.
- Untouched v3.1.1 passed the existing suite while all three new behavior regressions failed, establishing the reported cross-lane and withdrawal-combat gaps before the fixes were applied.
- The screenshot was treated as observed evidence; completion was not claimed from the screenshot alone.

### Efficiency / Complexity Audit — Rejected Optimizations
- A staggered/stale supplemental threat-cache experiment was rejected after run `31373019704` passed **26/27** but produced **0 fortress hits** across all nine protected natural-siege seeds.
- A second reuse/cached-target experiment was also rejected after run `31373698210` passed **26/27** but again produced **0 fortress hits** across all nine protected natural-siege seeds.
- The natural-siege acceptance condition was not weakened.
- Both optimization designs were removed from the final tree.
- The final behaviorally correct v3.2 build nevertheless completed the full deployed suite in about **4.0 minutes**, so no performance regression remained in the accepted candidate.

### Test Maintenance
- Two existing assertions still expected the old v3.1 version/title after v3.2 behavior was already working.
- Those stale assertions were advanced to v3.2 without weakening the gameplay conditions they protect.

### Final Deployed Verification — AUTOMATED VERIFIED CANDIDATE
- Exact verified gameplay HEAD: `5947664faf28c063618cff6cc201744d26687b2a`.
- Protected Vercel preview: `trendy-game-r63j5pfb0-chclpersonal-9731s-projects.vercel.app`.
- GitHub Actions run **`31374487249` passed 27/27 Playwright tests** in about **4.0 minutes**.
- Evidence artifact ID: **`9057493425`**.
- Evidence artifact SHA256: `7f6b2c6fd5f34e1958621ec195b9f55337bc7e0b6941258ad0fc698cd56169b5`.
- New regressions prove cross-lane engagement, firing while withdrawing, commander withdrawal self-defense, isolated Makashi dueling, and Shii-Cho crowd preference.
- The previous 22 frontend/v3.1.1 regressions all remained green.

### Economy Audit — 4 × 600 Seconds
- Seeds 32101–32104 all remained finite and valid.
- Peak living army: **61**.
- Peak companies: **11**.
- Maximum sampled D share: about **3.70%**.
- Highest sampled treasury: about **$603.76**.
- The prior v3.1.1 high-treasury observation did not reproduce in this sample, but remains preserved as historical evidence below.

### Natural-Siege Audit — 9 × 900 Seconds
- Seeds 32201–32209 all remained technically valid and below the 150-soldier / 11-company limits.
- Only **seed 32206** produced fortress damage.
- Right produced **2 fortress hits**.
- Minimum Right BREACH-to-fortress distance was about **284.295**.
- Left E fortress fell from **6500 to about 6486.24 HP**.
- The other eight seeds produced zero fortress hits.
- Natural fortress conversion therefore remains possible without restoring the old v3.1 sustained-siege outlier.

### Roadmap
- F Class — STABLE.
- E Class — STABLE.
- D Class foundation — STABLE.
- v3.2 Makashi + tactical combat continuity — **AUTOMATED VERIFIED CANDIDATE**.
- **C Class — NEXT CLASS**; the prior commander-form verification gate is now satisfied.
- **Form III Soresu — LATER**, isolated from the C-Class implementation.
- Continue tracking siege-blocked treasury accumulation without weakening fieldwork logistics.
- Preserve healthy future rank ecology: every unlocked rank remains directly buyable and earnable; avoid exponentially vanishing high-rank presence.

## Frontend Rework — Battle-First Interface

### Rework — Remove Generic Generated-UI Chrome
- Replaced the old stack of bordered dashboard cards with a flat battlefield + information-rail layout.
- Removed player-facing development/release material from the game screen: **Phase 3 Rules, Commander Forms, Roadmap, General AIs**, release-note-style header copy, and paragraph-length helper prose.
- Project/runtime roadmap validation remains intact; the roadmap is hidden from the normal game surface rather than deleted from simulation state.
- The battlefield is now the dominant surface instead of one card among many.

### Simplification — Clear Battle Hierarchy
- Added explicit **Left / Right** columns instead of packing paired values into slash-separated strings.
- Primary visible information is limited to battle state: troops, commanders, treasury, fortress HP, kills, strategy, plan, momentum, positions, command integrity, uncommanded troops, E/D counts, reload state, fortress hits, and wars won.
- Advanced economy, command, fortress, combat, calibration, and seed telemetry remains available under one closed-by-default **Details** disclosure.
- Replaced the global monospace interface with the system UI font while keeping tabular numerals for live statistics.
- No gradients, neon glow, pill-badge styling, or rounded-card stack was introduced.

### Patch — Responsive Layout
- Desktop uses battlefield + compact information rail.
- Mobile places the battlefield above the information panel.
- Horizontal battlefield movement remains contained inside the battlefield scroller.
- Existing **Pause/Resume, Speed, Front, Restart** behavior and labels are preserved.

### Audit — Web-Guided UI Cleanup
- The rework was guided by current interface recommendations emphasizing concise wording, clear hierarchy, removing unnecessary elements, and hiding secondary detail until relevant.
- The audit also explicitly targeted repeated outlined dashboard rectangles and other recognizable generic AI-generated interface defaults.
- Visual screenshots were captured for desktop and 412×915 mobile layouts and manually inspected after the deployed run.

### Final Deployed Verification — AUTOMATED VERIFIED CANDIDATE
- Exact verified deployed HEAD: `910ce709bd3c2505005e32e8bbdd8db7fdc34896`.
- Protected Vercel preview: `trendy-game-5l9jf5iof-chclpersonal-9731s-projects.vercel.app`.
- GitHub Actions run **`31365761574` passed 22/22 Playwright tests** in about **4.0 minutes**.
- Evidence artifact ID: **`9054170465`**.
- New UI regressions prove the old development chrome/card stack is absent, Left/Right battle columns exist, Details is collapsed by default, and mobile has no page-level horizontal overflow.
- The previous 20 v3.1.1 gameplay/technical regressions remain green.
- The 4×600-second economy and 9×900-second siege telemetry reproduced the prior v3.1.1 values exactly, providing evidence that the frontend rework did not alter simulation behavior.

### Roadmap
- F Class — STABLE.
- E Class — STABLE.
- D Class — **NOW: v3.1.1 automated verified candidate**.
- Battle-first frontend rework — **DONE / verified**.
- **Form II Makashi — NEXT**, isolated as its own commander-form slice.
- C Class — NEXT CLASS after the commander-form slice is independently verified.

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
- BREACH viability requires both at least 6 living company musketeers and an active command source, preventing an unjoined replacement from restoring siege authority early.

### Bug Fix — Coordinated Withdrawal
- `RALLY` and rearward `DEFEND` move the commander and soldiers as a company instead of allowing the commander to retreat alone.
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
- The old large-company behavior is preserved while small companies can correctly finish rebuilding.

### Audit / UI — Siege-Blocked Emergency Recovery
- The four-seed economy audit contains a high-cash wiped-army observation: seed 32103 reached about **$2,304.97** and ended with 0 Left musketeers.
- Recovery logic was audited rather than immediately rebalancing income.
- When an army has fewer than 7 musketeers and paid recruitment is blocked by a viable enemy BREACH, the General reports **`MUSTER BLOCKED`** instead of misleadingly reporting `RECOVER F`.
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
- The 117-hit sustained-BREACH warning did **not reproduce**, while natural fortress conversion remains possible.

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
- Commanders choose a **target company load from 2–14 musketeers** instead of treating 14 as the default working size.
- Mission posture biases the choice: **BUILD 2–6, DEFEND 4–8, CONTEST 5–10, ATTACK 8–12, SIEGE 10–14**.
- High upkeep pressure pushes new commanders toward smaller targets.
- Runtime doctrine labels are **LEAN** (2–5), **BALANCED** (6–10), and **MASS** (11–14).
- The hard maximum remains 14 living musketeers per company.

### AI / Structural Rework — Preserve the 150-Soldier Ceiling
- Added an **11-company maximum per army**, matching `ceil(150 / 14)`.
- Recruitment fills each command only to its chosen target before opening another company while commander slots remain.
- If all 11 company slots are occupied and the General still needs soldiers, existing commanders may expand target load one at a time up to 14.
- This prevents unlimited commander spam from tiny companies while preserving a real path to the 150-musketeer hard ceiling.

### Cohesion Rework — Smaller Is Tighter, Larger Is Heavier
- Cohesion scales continuously with current living company load from **1.22 at 2 soldiers** to **0.84 at 14 soldiers**.
- Smaller companies gain tighter spacing, faster formation recovery, shorter commander decision intervals, and faster formal-volley synchronization.
- Larger companies trade some coordination for simultaneous musket mass, attrition depth, and easier access to threshold mechanics.
- Formal volleys require at least 4 ready musketeers, counter-charge evaluation at least 5 company musketeers, and BREACH viability at least 6.
- No raw musket damage, generic accuracy, global reload, or rank-stat bonus was added to small companies.

### Audit / Validation Hardening
- Runtime state exposes company target size, doctrine, cohesion factor, cohesion spacing threshold, formation speed, decision scale, volley synchronization time, and target-size expansion count.
- `GameTest.validate()` rejects company target sizes outside 2–14 and armies exceeding 11 companies, in addition to the 14-per-company and 150-per-army checks.
- Test API exposes company sizing/cohesion functions for direct tradeoff verification.
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
