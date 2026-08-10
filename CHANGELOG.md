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
- D target share is intentionally small: roughly **2–8%** by stance.
- D procurement is restricted to a **surplus top-off**: the living army must already be within two soldiers of desired strength, upkeep pressure must be below 78%, and the treasury must cover the normal reserve, D's $80 price, and an extra $120 buffer.
- Rebuild/recovery procurement therefore remains F/E-first instead of spending scarce recovery cash on D.
- Phase-2 F $10 / E $32 / $10/s base income / 1.60% army-value upkeep baseline is preserved.

### Bug Fix / Rejected Economy Normalization
- First v3.0 candidate normalized price-quality income across the raw F→D price span. Although mathematically tidy, it silently reduced the established E quality bonus and the unchanged three-seed natural-siege gate fell to zero fortress hits.
- Rejected that formula. F and E now retain the exact Phase-2 price-quality contributions of 0 and 1; D adds a bounded 1.5 contribution while its full $80 price still counts toward upkeep.
- Added a regression proving a 14-F + 1-E army still receives rank bonus 1/15 and price bonus 1/15, exactly preserving the prior F/E relationship.

### Test Fix
- Corrected the direct-D purchase assertion to measure treasury immediately after purchase. The first test incorrectly measured after a subsequent F kill bounty and therefore reported $75 even though the actual D purchase had correctly deducted $80.

### Minor / UI
- Added exact D living count and E→D promotion telemetry.
- Replaced duplicate E-purchase UI rows with one compact E/D rank-purchase row.
- D soldiers receive a second bayonet-mark visual and bold D veteran label.
- Static `game.html` now directly identifies Phase 3 v3.0 instead of relying on late JavaScript to overwrite stale v2.19 copy.

### Code / Complexity
- Removed the v2.x release-state wrapper and runtime version-copy patching from `src/10.js`; source state, static HTML and test API now agree directly on v3.0.
- Rank comparison is centralized through `rankScoreOf()` / `rankAtLeast()` so D correctly inherits E-capable behavior without repeating `E || D` conditions.
- Test validation rejects any living non-commander rank outside the currently unlocked F/E/D set.

### Phase-3 automated gate
- Expanded to **11 deployed-browser tests**: Phase-3 invariants, direct/earned D progression, F/E economy-compatibility, D drilled fire, 300s self-play, four-seed D procurement/economy, natural siege, commander recovery, fieldwork block/reopen, controlled BREACH, and controls.
- The first v3.0 candidate run `31351540126` passed 8/10 but failed the direct-cost assertion bug and, more importantly, failed natural siege with 0 fortress hits. The siege failure was treated as a real baseline regression and not waived.

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
