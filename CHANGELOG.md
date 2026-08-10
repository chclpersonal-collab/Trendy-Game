# Changelog

## Phase 3 v3.0 — D-Class Foundation / Drilled Fire

### Major Update — D Class unlocked
- Phase 2 / E Class is recorded as stable after its exact deployed v2.21 gate passed 8/8 and the user supplied no comments under the project acceptance convention.
- D Class is now the Phase 3 current rank; C Class remains locked as Phase 4.
- D may be bought directly for **$80** or earned by an E soldier at **10 total XP**, preserving the established dual-path rank policy.
- The existing 50% defeated-rank bounty rule makes a D kill worth **$40**.

### Rework / New Rank Identity — Drilled Fire
- D inherits E's automatic bayonet charge instead of receiving a second overlapping melee system.
- D gains **+3.5 percentage points musket aim** and a **2-second reload drill bonus**.
- D reload has a **25-second floor** after veteran effects; the global base reload remains 30 seconds and F/E reload behavior is unchanged.
- D combat weight is modestly above E for General strategic comparisons rather than being treated as multiple ordinary soldiers.

### AI / Economy
- General AI now procures F, E and D.
- D target share is intentionally small: roughly **2–8%** by stance, with highest demand during siege/attack.
- Upkeep pressure can force the General back to F/E procurement before D fills the army.
- Army-quality income normalization now uses the F→D price span so adding an $80 rank does not accidentally create an outsized passive-income multiplier.
- Phase-2 F $10 / E $32 / $10/s base income / 1.60% army-value upkeep baseline is preserved for the first D sample.

### Minor / UI
- Added exact D living count and E→D promotion telemetry.
- Replaced duplicate E-purchase UI rows with one compact E/D rank-purchase row.
- D soldiers receive a second bayonet-mark visual and bold D veteran label.
- Static `game.html` now directly identifies Phase 3 v3.0 instead of relying on late JavaScript to overwrite stale v2.19 copy.

### Code / Complexity
- Removed the v2.x release-state wrapper and runtime version-copy patching from `src/10.js`; source state, static HTML and test API now agree directly on v3.0.
- Rank comparison is centralized through `rankScoreOf()` / `rankAtLeast()` so D correctly inherits E-capable behavior without repeating `E || D` conditions.
- Test validation now rejects any living non-commander rank outside the currently unlocked F/E/D set.

### Tests added for Phase 3
- Direct $80 D purchase and controlled E→D promotion at 10 XP.
- Controlled D aim/reload advantage with a preserved 30-second global base.
- Four 600-second D procurement/economy samples requiring D to appear while remaining below a 30% sampled army share.
- Existing natural siege, commander recovery, fieldwork block/reopen, controlled BREACH and UI-control gates remain in the deployed suite.

### Acceptance convention
- No separate human-playtest gate is required. When the user gives no comments after an update, the update is treated as accepted/good.
- Automated technical failures still block advancement and are fixed rather than overridden by the no-comments convention.

## Phase 2 v2.21 — Final Pricing Calibration / Command-Recovery Audit

### Patch — Experimental Pricing 15/15 / FINAL SCHEDULED CALIBRATION
- Advanced the scheduled experimental-pricing counter from 14/15 to **15/15**.
- Held F at $10, E at $32, base passive income at $10/s, F bounty at $5, E bounty at $16, and upkeep at 1.60% of living army value/s.
- No fortress, musket, E-charge, command-radius, BREACH-pressure, or company-cap rebalance was stacked onto the final pricing sample.
- Patch 15 completes the planned calibration sequence but does not make the values permanently immutable; later evidence may still justify a change.

### Audit — Final Economy Calibration
- Four deterministic 600-second deployed-browser economy samples peaked at about $610.62 while retaining direct E purchases and earned F→E promotion.
- The exact protected v2.21 run `31350330442` passed **8/8** Playwright tests in **55.7 seconds**.
- Natural seed 21902 again produced 4 fortress hits at about 214.022 minimum fortress distance; seeds 21901 and 21903 produced zero fortress hits.

### Rework Audit — Separated-Commander Soldier Fallback REJECTED
- A proposed soldier fallback toward a separated living commander worked mechanically but erased natural fortress hits in the unchanged siege gate and caused heavy rejoin churn.
- The fallback was removed; the accepted baseline keeps the commander physically returning to the company before normal soldier rejoin resumes.
