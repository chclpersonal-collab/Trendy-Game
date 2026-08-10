# Changelog

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
- **Form II — Makashi** remains the leading v3.1 candidate.

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
