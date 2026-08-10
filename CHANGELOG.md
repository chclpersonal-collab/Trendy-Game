# Changelog

## Phase 3 v3.0 — D-Class Foundation / Assault Drill

### Major Update — D Class unlocked
- Phase 2 / E Class is recorded as stable after its exact deployed v2.21 gate passed 8/8 and the user supplied no comments under the project acceptance convention.
- D Class is now the Phase 3 current rank; C Class remains locked as Phase 4.
- D may be bought directly for **$80** or earned by an E soldier at **10 total XP**, preserving the established dual-path rank policy.
- The existing 50% defeated-rank bounty rule makes a D kill worth **$40**.
- Direct D starts at the 10-XP D floor; every earned XP continues to restore 20 HP up to full health.

### Rework — D identity changed from passive drill to Assault Drill
- The initial universal passive D fire advantage was rejected after repeated deployed-browser testing showed it suppressed natural fortress conversion broadly, even with D as only a small army minority.
- Final D inherits E's automatic bayonet charge without extra melee damage.
- D's special musket drill now activates only under **SIEGE, BREACH, or commander CHARGE** company orders.
- During the drill, D gains **+3.5 percentage points musket aim**, a **2-second reload drill bonus**, and a **25-second reload floor** after veteran effects.
- Outside assault orders, D uses an **E-equivalent veteran combat baseline**, preventing a universal defensive-line buff.
- D strategic combat weight is E-equivalent in ordinary fighting and rises modestly only while the General is in SIEGE.

### AI / Procurement Rework
- General AI may buy F, E and D, but D is not a routine replacement tier.
- Routine D target outside SIEGE is **0%**; SIEGE target is up to about **8%**.
- D procurement is allowed only as a funded siege top-off: army within two soldiers of desired strength, upkeep pressure below 78%, and treasury sufficient for the normal reserve + $80 D price + a $120 surplus buffer.
- Recovery/rebuild procurement remains F/E-first.
- A permanent regression proves the General will not choose D in CONTEST but can choose it under a properly funded SIEGE.

### Bug Fix — preserve Phase-2 F/E economy
- The first v3.0 candidate normalized the existing price-quality term across the raw F→D price span. That silently reduced E's established quality-income contribution and failed the natural-siege gate.
- Rejected that formula.
- F retains price-quality contribution 0 and E retains contribution 1 exactly as in Phase 2; D contributes a bounded 1.5.
- D's full **$80** still counts toward army-value upkeep, avoiding a passive-income windfall.
- Added a regression proving a 14-F + 1-E army still receives rank bonus `1/15` and price-quality bonus `1/15`.

### Test Fix
- Corrected the direct-D purchase assertion to measure treasury immediately after the purchase.
- The original test measured after the promoted soldier also earned a $5 F kill bounty and therefore falsely reported a $75 cost even though the purchase had correctly deducted $80.

### Minor / UI
- Added D living-count and E→D promotion telemetry.
- Consolidated the purchase display into a compact E/D rank-purchase line.
- D soldiers have a distinct second bayonet mark and bold D veteran label.
- Static `game.html` now identifies Phase 3 v3.0 directly instead of carrying stale v2.19 metadata.
- Final player-facing rules explicitly describe D as an **assault-dependent** drill rather than a passive universal buff.

### Code / Complexity
- Removed the v2.x runtime release-state/version-copy wrapper so static HTML, runtime state, and the test API agree directly.
- Centralized rank inheritance through `rankScoreOf()` / `rankAtLeast()` instead of duplicating E-or-D conditions.
- Added `dAssaultDrillActive()` and `veteranCombatXP()` so D's assault-only behavior is expressed in one place for aim, reload, and movement-veteran scaling.
- Test validation rejects any living non-commander rank outside the currently unlocked F/E/D set.
- Runtime telemetry now records D drill orders, E-equivalent non-assault baseline, siege-only funded procurement, and the 0–8% target range.

### Rejected Candidate Evidence
- **Run `31351540126`: 8/10 passed.** The first v3.0 candidate had a test-accounting error and a real siege regression; natural fortress hits fell to zero.
- **Run `31351758849`: 10/11 passed.** F/E economy compatibility was restored and D was limited to surplus top-off, but the old three-seed siege sample still produced zero fortress hits.
- A subsequent broader nine-seed × 600-second audit also produced zero fortress hits with the universal passive D advantage, proving the problem was structural rather than merely deterministic seed drift.
- The passive design was therefore removed instead of weakening the siege gate or buffing BREACH globally.

### Final Phase-3 Automated Verification — AUTOMATED VERIFIED CANDIDATE
- Final verified deployed HEAD: `cfe77f5ab77931f7fe26c7a71323a32a132be33b`.
- Protected Vercel preview: `trendy-game-nat3zy2hx-chclpersonal-9731s-projects.vercel.app`.
- GitHub Actions run **`31352532990` passed 12/12 Playwright tests** in about **2.1 minutes** of browser-test execution.
- Exact deployed tests covered Phase-3 invariants, direct/earned D progression, Phase-2 F/E economy compatibility, assault-drill activation, siege-only D procurement, deterministic 300-second self-play, four-seed D/economy calibration, broad natural siege, commander recovery, fieldwork block/reopen, controlled BREACH damage, and UI controls.

### D / Economy Calibration — 4 × 600 seconds
- Seeds 30101–30104 all preserved finite state, nonnegative treasury, valid fortress HP, company cap, unlocked ranks, and the 15-phase roadmap.
- Maximum sampled treasury was about **$502.27**.
- Maximum sampled D share was about **4.65%**, well below the 30% acceptance ceiling.
- Direct D purchases remained sparse and battlefield E→D promotions still occurred naturally.

### Natural Siege — Phase-3 Acceptance
- The old Phase-2 comparison seeds 21901–21903 no longer reproduce the exact v2.21 breakthrough under D-era rules; they remain recorded as comparison telemetry.
- Phase 3 uses a broader nine-seed × 600-second acceptance sample, seeds 30201–30209.
- All nine runs preserved technical invariants.
- **Seed 30209 produced 2 natural Left fortress hits**, reached about **213.900** minimum BREACH-to-fortress distance, and reduced the Right E fortress from **6500 HP to about 6482.35 HP**.
- The other eight Phase-3 acceptance seeds produced zero fortress hits, demonstrating that natural fortress conversion remains possible without becoming routine.
- Peak uncommanded populations still sometimes reach the 50s; this remains an open cohesion observation rather than a claim of resolution.

### Acceptance Convention / Roadmap
- No separate human-playtest gate is required.
- Automated technical failures still block advancement.
- After this technically verified v3.0 update is delivered, **no user comments means accepted/good**.
- C Class remains locked until D is accepted/stabilized.
- **Form II — Makashi** is the leading v3.1 candidate and remains locked during v3.0 so the initial D sample stays isolated.

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
