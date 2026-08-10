# Changelog

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
- Runtime state now exposes company target size, doctrine, cohesion factor, cohesion spacing threshold, formation speed, decision scale, volley synchronization time, and target-size expansion count.
- `GameTest.validate()` now rejects company target sizes outside 2–14 and armies exceeding 11 companies, in addition to the existing 14-per-company and 150-per-army checks.
- Test API exposes the company sizing/cohesion functions for direct tradeoff verification.
- Package version advanced to **3.1.0**.

### Final Deployed Verification — AUTOMATED VERIFIED CANDIDATE
- Verified gameplay HEAD: `b207d8ff686a14e736a5a8f868984272187b6348`.
- Protected Vercel preview: `trendy-game-m98ojans8-chclpersonal-9731s-projects.vercel.app`.
- GitHub Actions run **`31355086417` passed 14/14 Playwright tests** in about **5.1 minutes** of browser-test execution.
- Evidence artifact ID: `9050434042`.
- Exact tests covered the 0-soldier reset, direct small-vs-large cohesion tradeoffs, 151st-purchase rejection, D progression and Assault Drill, Phase-2 F/E economy compatibility, autonomous 300-second play, four 600-second economy samples, nine 900-second natural-siege samples, physical commander return, fieldwork recruitment control, controlled BREACH damage, and UI controls.

### Adaptive-Company Economy Audit — 4 × 600 Seconds
- Seeds 32101–32104 all preserved finite state, nonnegative treasury, valid fortress HP, company/army limits, unlocked ranks, and the 15-phase roadmap.
- Peak living army size across the four samples was **59 musketeers**.
- Peak company count reached the full **11-company** structural limit without exceeding it.
- Maximum sampled D share was about **5.56%**.
- Company targets naturally varied across lean, balanced, and mass commands, including values from 3 through 14 in this four-seed set.
- Highest sampled treasury was about **$1,474.37** in seed 32103. This remains below the $3,000 automated ceiling and is technically bounded, but is materially higher than earlier zero-start samples and remains an explicit balance observation.

### Adaptive-Company Natural Siege Audit — 9 × 900 Seconds
- Seeds 32201–32209 all preserved technical invariants, remained below 150 musketeers per army, and stayed at or below 11 companies.
- Natural commander choices included **2-soldier target companies**, proving small-company doctrine occurs autonomously rather than only in direct unit tests.
- **Seed 32205:** Right produced **6 fortress hits**, reached about **214.324** minimum BREACH distance, and reduced the Left E fortress from 6500 HP to about **6454.65**. Peak armies were 60 / 59; peak company counts 11 / 10.
- **Seed 32206:** Left produced **117 fortress hits**, reached about **214.194** minimum BREACH distance, and reduced the Right F fortress from 4500 HP to about **3575.58**. Peak armies were 61 / 58; peak company counts 11 / 10.
- The other seven sampled seeds produced zero fortress hits.
- Natural fortress conversion therefore remains possible under adaptive company sizing.

### Balance Audit — Sustained BREACH Warning
- Seed 32206's **117-hit** sustained BREACH is not a technical invariant failure and did not destroy the fortress during the sample, but it is much heavier siege pressure than prior Phase-3 samples.
- The result is recorded as a balance warning rather than hidden or normalized away.
- v3.2 should audit sustained siege pressure before stacking another commander combat multiplier such as Makashi.

### Roadmap
- F Class — STABLE.
- E Class — STABLE.
- D Class — **NOW: v3.1 automated verified candidate**.
- C Class — NEXT CLASS, still locked until Phase-3 company/economy pressure stabilizes.
- Form I Shii-Cho — STABLE.
- Form II Makashi — still the next commander-form candidate, but deferred from this update; v3.2 should first audit the v3.1 siege-pressure and treasury observations.

## Phase 3 v3.0 — D-Class Foundation / Assault Drill

### Major Rework — Zero-Start Armies / 150-Soldier Ceiling
- Every new war now begins with **0 musketeers per army** instead of 14 free F musketeers.
- Each General retains its starting treasury and must build the army through actual purchases.
- Raised the hard musketeer ceiling from **56 to 150 per army**, allowing up to **150 vs 150** musketeers.
- Commanders are separate from the 150-musketeer count.
- The existing **14 musketeers per commander/company** cap remains unchanged. A full 150-soldier army therefore uses 11 companies: ten full 14-soldier companies and one 10-soldier company.
- 150 is a hard ceiling, not an AI target; General force sizing still depends on enemy strength, strategy, treasury, reserve, and upkeep.

### Bug Fix — True Army-Wide Cap Enforcement
- Fixed `companyWithRoom()` checking for spare company capacity before checking the army-wide cap.
- Without the fix, a 151st musketeer could have entered a partially filled last company even when `MAX_MUSKETEERS` was 150.
- The army-wide count is now checked first.
- `GameTest.validate()` now explicitly reports and rejects `overArmyCapacity` and exposes `maxPerArmy: 150`.
- Added a deployed regression that buys 151 musketeers with effectively unlimited treasury and proves exactly 150 succeed, the 151st fails, all companies remain ≤14, and the final army has 11 commanders/companies.

### Automated Verification — Zero Start / 150 Cap
- Verified deployed HEAD: `60ade9918a183e8887f51fd394149eb0a254901f`.
- Protected Vercel preview: `trendy-game-hi5vunley-chclpersonal-9731s-projects.vercel.app`.
- GitHub Actions run **`31353827658` passed 13/13 Playwright tests** in about **4.0 minutes**.
- Fresh reset state is explicitly verified as **0 / 0 musketeers** with **1 / 1 initial commanders** before autonomous simulation advances.
- 300-second autonomous zero-start self-play proves both Generals can build functioning armies from nothing while state remains finite and bounded.

### Zero-Start Economy Audit — 4 × 600 Seconds
- Seeds 31101–31104 all preserved finite state, nonnegative treasury, valid fortress HP, company cap, army cap, unlocked ranks, and the 15-phase roadmap.
- Highest sampled treasury was about **$554.60**.
- Largest sampled living army in this four-seed set was **64** musketeers.
- Maximum sampled D share was about **2.86%**.
- Direct D purchases remained sparse and earned E→D promotion still occurred.
- The General therefore does not automatically fill the new 150 ceiling; normal economic force sizing remains active.

### Zero-Start Natural Siege Audit — 9 × 900 Seconds
- Seeds 31201–31209 all preserved technical invariants and stayed below 150 musketeers per army.
- **Seed 31202:** Left produced **18 natural fortress hits**, reached about **213.951** minimum BREACH distance, and reduced the Right E fortress from 6500 HP to about **6359.19**; peak armies were **77 / 78**.
- **Seed 31203:** Left produced **53 natural fortress hits**, reached about **200.040** minimum BREACH distance, and reduced the Right E fortress from 6500 HP to about **6076.89**; peak armies were **54 / 54**.
- The other seven seeds produced zero fortress hits.
- Removing the free starting army therefore does not eliminate natural siege conversion.

### Test Fix — Initial-State Timing
- First zero-start run `31353568973` passed **12/13** tests.
- The only failure expected 0 / 0 immediately after page load, but autonomous AI had already advanced for a fraction of a second and bought 3 F musketeers per side before the test clicked Pause.
- This was a test-timing error, not a game-rule failure: the hard-cap, self-play, economy, natural-siege, commander, fieldwork, BREACH, and controls tests all passed in that same run.
- Corrected the test to pause and explicitly reset before inspecting the default state. No gameplay workaround was added.

### Major Update — D Class unlocked
- Phase 2 / E Class is stable.
- D Class is the Phase 3 current rank; C Class remains locked as Phase 4.
- D may be bought directly for **$80** or earned by an E soldier at **10 total XP**.
- The existing 50% defeated-rank bounty rule makes a D kill worth **$40**.
- Direct D starts at the 10-XP D floor; every earned XP restores 20 HP up to full health.

### Rework — D identity changed from passive drill to Assault Drill
- The initial universal passive D fire advantage was rejected after repeated deployed-browser testing showed it suppressed natural fortress conversion broadly.
- Final D inherits E's automatic bayonet charge without extra melee damage.
- D's special musket drill activates only under **SIEGE, BREACH, or commander CHARGE** company orders.
- During the drill, D gains **+3.5 percentage points musket aim**, a **2-second reload drill bonus**, and a **25-second reload floor** after veteran effects.
- Outside assault orders, D uses an **E-equivalent veteran combat baseline**.

### AI / Procurement Rework
- Routine D target outside SIEGE is **0%**; SIEGE target is up to about **8%**.
- D procurement is allowed only as a funded siege top-off: army within two soldiers of desired strength, upkeep pressure below 78%, and treasury sufficient for the normal reserve + $80 D price + a $120 surplus buffer.
- Recovery/rebuild procurement remains F/E-first.

### Bug Fix — Preserve Phase-2 F/E Economy
- Rejected the first v3.0 formula that normalized price-quality income across the raw F→D price span because it reduced E's established contribution and broke siege behavior.
- F retains price-quality contribution 0 and E retains contribution 1; D contributes a bounded 1.5.
- D's full **$80** still counts toward army-value upkeep.
- Regression coverage proves a 14-F + 1-E army still receives rank bonus `1/15` and price-quality bonus `1/15`.

### Minor / UI / Code
- Added D living-count and E→D promotion telemetry.
- D soldiers have a distinct second bayonet mark and bold D veteran label.
- Static `game.html` identifies Phase 3 v3.0 directly.
- Centralized rank inheritance through `rankScoreOf()` / `rankAtLeast()`.
- Added `dAssaultDrillActive()` and `veteranCombatXP()` for D's assault-only behavior.
- Runtime validation rejects ranks outside currently unlocked F/E/D.

### Earlier v3.0 Candidate Evidence
- Run `31351540126`: **8/10 passed**; exposed a test-accounting mistake and a real siege/economy regression.
- Run `31351758849`: **10/11 passed**; F/E economy was restored, but universal passive D still suppressed fortress conversion.
- Broader nine-seed testing confirmed the passive D design was structurally harmful, so it was removed instead of weakening siege acceptance.
- The Assault Drill redesign later passed the full deployed gate and is retained.

### Acceptance Convention / Roadmap
- No separate human-playtest gate is required.
- Automated technical failures still block advancement.
- After a technically verified update is delivered, **no user comments means accepted/good**.
- C Class remains locked until D is accepted/stabilized.
- **Form II — Makashi** remained the leading post-v3.0 candidate before v3.1 prioritized adaptive company cohesion.

## Phase 2 v2.21 — Final Pricing Calibration / Command-Recovery Audit

### Patch — Experimental Pricing 15/15 / FINAL SCHEDULED CALIBRATION
- Advanced the scheduled experimental-pricing counter from 14/15 to **15/15**.
- Held F at $10, E at $32, base passive income at $10/s, F bounty at $5, E bounty at $16, and upkeep at 1.60% of living army value/s.
- No fortress, musket, E-charge, command-radius, BREACH-pressure, or company-cap rebalance was stacked onto the final pricing sample.
- Patch 15 completes the planned calibration sequence but does not make the values permanently immutable; later evidence may still justify a change.

### Audit — Final Economy Calibration
- Four deterministic 600-second deployed-browser economy samples peaked at about $610.62 while retaining direct E purchases and earned F→E promotion.
- The exact protected v2.21 run `31350330442` passed **8/8** Playwright tests in **55.7 seconds**.
- Natural seed 21902 produced 4 fortress hits at about 214.022 minimum fortress distance; seeds 21901 and 21903 produced zero fortress hits.

### Rework Audit — Separated-Commander Soldier Fallback REJECTED
- A proposed soldier fallback toward a separated living commander worked mechanically but erased natural fortress hits in the unchanged siege gate and caused heavy rejoin churn.
- The fallback was removed; the accepted baseline keeps the commander physically returning to the company before normal soldier rejoin resumes.
