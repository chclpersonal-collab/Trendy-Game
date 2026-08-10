# Musketeer Battle Simulator

Autonomous two-army musketeer battle simulation developed on the single rolling branch `agent/current`. Technical completion claims are evidence-gated by the exact deployed Vercel/Playwright build. **Project acceptance convention:** after an update is delivered, no user comments means the update is accepted/good; a separate human-playtest gate is not required.

## Current state

- **Phase 1 / F Class:** STABLE
- **Phase 2 / E Class:** STABLE
- **Current:** Phase 3 **v3.1 — Adaptive Company Cohesion**
- **Status:** **AUTOMATED VERIFIED CANDIDATE**
- **Latest verified deployed gameplay HEAD:** `b207d8ff686a14e736a5a8f868984272187b6348`
- **Protected Playwright run:** `31355086417` — **14/14 passed**
- **Protected Vercel preview:** `trendy-game-m98ojans8-chclpersonal-9731s-projects.vercel.app`
- **Army foundation:** 0 starting musketeers, 150-musketeer hard ceiling per side
- **Pricing calibration:** 15/15 complete
- **Commander Form I / Shii-Cho:** STABLE
- **Form II / Makashi:** DEFERRED while v3.1 siege-pressure evidence is audited

## v3.1 — Adaptive Company Cohesion

Commanders no longer treat 14 musketeers as the default working company size. Each commander chooses a **target load from 2–14 musketeers**, creating a real tradeoff between tight command and battlefield mass.

### Commander company-size choices

Mission posture influences the size a new commander prefers:

- **BUILD:** 2–6
- **DEFEND:** 4–8
- **CONTEST:** 5–10
- **ATTACK:** 8–12
- **SIEGE:** 10–14

High upkeep pressure can push new companies toward smaller targets. The choice is not a permanent hard lock: if all 11 company slots are occupied and the General still needs troops, existing commanders can expand their target loads one soldier at a time up to 14. This preserves the absolute path to the 150-musketeer army ceiling.

The runtime labels company doctrine as:

- **LEAN:** target 2–5
- **BALANCED:** target 6–10
- **MASS:** target 11–14

### Cohesion tradeoff

Cohesion scales continuously with the **current living company load**, from a factor of **1.22 at 2 soldiers** to **0.84 at 14 soldiers**.

Smaller companies gain:

- tighter longitudinal spacing before cohesion correction begins
- faster formation/reform movement
- faster commander decision cadence
- faster synchronization when they have enough musketeers to execute a formal volley

Larger companies trade some cohesion for:

- more simultaneous musket mass
- greater attrition depth
- easier access to formal volleys, which require at least 4 ready musketeers
- counter-charge eligibility, which requires at least 5 company musketeers
- BREACH/spearhead viability, which requires at least 6 company musketeers

No raw musket damage, global reload, or generic accuracy bonus was added to small companies. The advantage is command quality rather than free damage.

### Structural limit

- **2–14** chosen target musketeers per commander/company
- **14** remains the hard living-musketeer maximum for one company
- **11 companies maximum per army**
- **150 musketeers maximum per army**
- commanders remain separate from the 150-musketeer count

Small-company doctrine therefore consumes scarce company/commander slots faster; commanders cannot create unlimited tiny squads to bypass the intended tradeoff.

## Army foundation — zero start / 150 maximum

Every new war begins with:

- **0 musketeers on the Left**
- **0 musketeers on the Right**
- one initial commander/company structure per side
- starting treasury **$175 per General**

The General AI builds its fighting force through the economy rather than receiving free musketeers at reset.

The 150 value is a **ceiling, not an AI target**. Force size still depends on enemy strength, strategy, treasury, reserves, and upkeep.

The army-wide cap is checked before company capacity. A permanent regression buys 151 musketeers with effectively unlimited treasury and proves exactly 150 succeed while the 151st is rejected.

## D Class / Assault Drill

D remains the current Phase-3 musketeer rank.

- Direct price: **$80**
- Earned promotion: **E → D at 10 total XP**
- Direct D starts at the **10 XP / D·0 floor**
- Kill bounty: **$40** under the 50%-of-rank-price rule
- D inherits E's automatic bayonet charge without extra bayonet damage
- every earned XP restores **20 HP**, capped at full health

D's special Assault Drill activates only under:

- `SIEGE`
- `BREACH`
- commander `CHARGE`

While active, D receives **+3.5 percentage points musket aim**, a **2-second reload drill bonus**, and a **25-second D reload floor** after veteran effects. Outside those orders D uses an E-equivalent veteran combat baseline. The global musket base reload remains **30 seconds**.

Routine D target outside SIEGE remains 0%; SIEGE target remains up to about 8%, and direct D procurement remains a funded siege top-off rather than the default replacement tier.

## Economy preservation

The established F/E/D economy remains unchanged by v3.1:

- F price-quality contribution: **0**
- E contribution: **1**
- D bounded contribution: **1.5**
- D's full **$80** value counts toward upkeep
- base passive income: **$10/s**
- living-army upkeep: **1.60% of army value/s**
- bounty rate: **50% of defeated musketeer rank price**

A regression still proves a 14-F + 1-E army receives rank bonus `1/15` and price-quality bonus `1/15`.

## v3.1 deployed verification

Exact run `31355086417` tested the protected Vercel preview from gameplay HEAD `b207d8ff686a14e736a5a8f868984272187b6348` and passed **14/14** Playwright tests in about **5.1 minutes** of browser-test execution.

The deployed gate proves:

- fresh wars still start at 0 / 0 musketeers
- commanders carry valid adaptive 2–14 target loads
- small-company cohesion metrics are stronger than large-company metrics
- large companies retain BREACH/mass eligibility advantages
- the 151st musketeer is still rejected
- no company exceeds 14 musketeers and no army exceeds 11 companies / 150 musketeers
- D direct/earned progression and Assault Drill remain valid
- F/E economy compatibility remains intact
- autonomous 300-second self-play remains finite
- fieldwork recruitment blocking/reopening remains valid
- separated commanders still return physically
- controlled BREACH still damages fortresses
- Pause / Speed / Front controls still work
- the 15-phase roadmap remains intact

### Adaptive-company economy audit — 4 × 600 seconds

Seeds 32101–32104 all preserved technical invariants.

- peak living armies: **50–59**
- peak company counts: **7–11**
- maximum sampled D share: about **5.56%**
- company targets naturally spanned small, medium, and large values, including targets from **3 through 14** in the four-seed sample
- highest sampled treasury: about **$1,474.37** in seed 32103

The treasury result remains below the test ceiling of $3,000 and is technically bounded, but it is materially higher than the earlier zero-start sample and remains a **balance observation**, not proof that the economy is perfectly calibrated.

### Adaptive-company natural siege — 9 × 900 seconds

Seeds 32201–32209 all remained finite and valid, stayed below 150 musketeers, and never exceeded 11 companies.

Natural company target selections included the full intended spectrum, including naturally selected **2-soldier** target companies in several seeds.

Two seeds converted naturally into fortress damage:

- **Seed 32205:** Right produced **6 fortress hits**, reached about **214.324** minimum BREACH distance, and reduced the Left E fortress from 6500 HP to about **6454.65**. Peak armies were **60 / 59** and peak company counts were **11 / 10**.
- **Seed 32206:** Left produced **117 fortress hits**, reached about **214.194** minimum BREACH distance, and reduced the Right F fortress from 4500 HP to about **3575.58**. Peak armies were **61 / 58** and peak company counts were **11 / 10**.

The other seven seeds produced zero fortress hits.

Seed 32206 proves that adaptive companies can sustain a long successful breach, but **117 hits is an intentionally recorded balance warning**. It does not violate technical invariants or destroy the fortress in the sample, yet siege-pressure severity should be audited before stacking another commander combat system on top.

## Rejected / corrected evidence

Failed and superseded candidates remain recorded rather than hidden:

1. Universal passive D drill + raw F→D economy normalization — rejected for changing the established E economy and suppressing natural siege.
2. Universal passive D combat advantage with restored F/E economy — still suppressed natural siege and was rejected.
3. Accepted D redesign — Assault Drill is conditional on assault orders and AI D procurement is siege-only funded top-off.
4. First zero-start test run `31353568973` — 12/13 passed; its only failure was an initial-state test-timing mistake, later corrected without a gameplay workaround.

## Preserved systems / hard invariants

- 15-phase class roadmap remains intact
- every war's musketeer default is **0 per side**
- maximum **150 musketeers per army**
- commanders choose company targets from **2–14 musketeers**
- maximum **14 living musketeers per commander/company**
- maximum **11 companies per army**
- commanders do **not** count against the 150-musketeer cap
- global musket base reload remains **30 seconds**
- F permanent melee is not introduced; F melee remains temporary low-power commander counter-charge behavior
- E retains autonomous bayonet charge; D inherits it rather than replacing it
- command remains local and regrouping/commander replacement remains physical
- base company command radius 180, individual soldier command radius 350, and rejoin completion radius 285 remain unchanged
- 110-second committed siege baseline and BREACH progress logic remain intact
- fieldwork paid-recruitment blocking remains intact
- fortress progression remains F → E; no D fortress is bundled into Phase 3
- Form I remains Shii-Cho; canonical Form II–VII identities are preserved
- only F/E/D are unlocked in Phase 3

## Branch policy

- `main` — accepted/stable baseline
- `agent/current` — the only active development branch

Do not create version-specific development branches. Legacy `update/v2.17`, `update/v2.18`, and `update/v2.19` refs are obsolete cleanup refs and do not drive CI.

## Roadmap

1. **F Class — STABLE**
2. **E Class — STABLE**
3. **D Class — NOW: v3.1 automated verified candidate**
4. **C Class — NEXT CLASS, locked until D / company-cohesion pressure stabilizes**
5. B Class
6. A Class
7. S Class
8. SS Class
9. SSS Class
10. SSS+ Class
11. SSS+ Class Type I
12. SSS+ Class Type II
13. SSS+ Class Type III
14. SSS+ Class Type IV
15. SSS+ Class Type V — final

### Near-term Phase 3 roadmap

- **v3.1:** Adaptive Company Cohesion — deployed gate passed 14/14
- **v3.2 candidate:** audit sustained siege pressure and the high-treasury outlier before adding another combat multiplier
- **Form II — Makashi:** still the next commander-form candidate, but deferred until the v3.1 siege-pressure audit is satisfactory
- **C Class:** remains locked until Phase-3 command/economy behavior is stable
- continue using the 150-soldier population space for healthy rank ecology rather than forcing every army toward the cap

## Verification / acceptance policy

- Failed experiments stay failed in the evidence; acceptance tests are not weakened to make a candidate pass.
- Automated browser evidence proves only the scenarios it actually tests.
- Automated technical failures block advancement.
- After a technically verified update is delivered, **no user comments means accepted/good**.
