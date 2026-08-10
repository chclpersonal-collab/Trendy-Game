# Musketeer Battle Simulator

Autonomous two-army musketeer battle simulation developed on the single rolling branch `agent/current`. Technical completion claims are evidence-gated by the exact deployed Vercel/Playwright build. **Project acceptance convention:** after an update is delivered, no user comments means the update is accepted/good; a separate human-playtest gate is not required.

## Current state

- **Phase 1 / F Class:** STABLE
- **Phase 2 / E Class:** STABLE
- **Current:** Phase 3 **v3.0 — D-Class Foundation / Assault Drill**
- **Status:** **AUTOMATED VERIFIED CANDIDATE**
- **Latest verified deployed HEAD:** `60ade9918a183e8887f51fd394149eb0a254901f`
- **Protected Playwright run:** `31353827658` — **13/13 passed**
- **Protected Vercel preview:** `trendy-game-hi5vunley-chclpersonal-9731s-projects.vercel.app`
- **Pricing calibration:** 15/15 complete
- **Commander Form I / Shii-Cho:** STABLE
- **Form II / Makashi:** NEXT FORM, deliberately locked during v3.0 so D musketeers and the new army foundation can be isolated first

## Army foundation — zero start / 150 maximum

Every new war now begins with:

- **0 musketeers on the Left**
- **0 musketeers on the Right**
- one initial commander/company structure per side
- starting treasury **$175 per General**

The General AI must build its fighting force through the economy rather than receiving 14 free F troops at reset.

The hard limit is now:

- **150 musketeers per army**
- therefore at most **150 vs 150 musketeers**
- commanders are separate from that 150-soldier count
- maximum **14 musketeers per commander/company** remains unchanged

At the absolute 150-soldier ceiling, an army needs **11 companies/commanders**: ten full 14-soldier companies plus one 10-soldier company.

The 150 value is a **ceiling, not an AI target**. The General still chooses force size according to enemy strength, strategy, treasury, reserves, and upkeep. In the current zero-start long-run samples, peak living armies were roughly **54–78 soldiers**, leaving substantial population headroom for future C-through-SSS+ ranks without forcing every war to fill the battlefield to 150 immediately.

### Hard-cap bug fix

The previous company-selection helper looked for spare room in an existing company before checking the army-wide limit. Under a larger cap that could have allowed a 151st musketeer into a partially filled final company. The army-cap check now occurs first, and a deployed regression explicitly proves the **151st purchase is rejected** while every company remains at 14 or fewer.

## v3.0 — D-Class Foundation / Assault Drill

### D Class progression

- Direct price: **$80**
- Earned promotion: **E → D at 10 total XP**
- Direct D starts at the **10 XP / D·0 floor**
- Kill bounty: **$40** under the existing 50%-of-rank-price rule
- D inherits E's automatic bayonet charge; no extra bayonet damage is added
- every earned XP continues to restore **20 HP**, capped at full health

### Assault Drill

D is not a universal passive upgrade over E. Its special musket drill activates only under an assault-oriented company order:

- `SIEGE`
- `BREACH`
- commander `CHARGE`

While active, D receives:

- **+3.5 percentage points musket aim**
- **2-second reload drill bonus**
- **25-second D reload floor** after veteran effects

Outside those orders, D uses an **E-equivalent veteran combat baseline**. The global musket base reload remains **30 seconds** and F/E behavior is unchanged.

### General AI D procurement

- routine D target outside siege: **0%**
- SIEGE target: up to about **8%**
- D is bought only when the army is within two soldiers of desired strength
- upkeep pressure must be below 78%
- treasury must preserve the normal reserve plus D's $80 price plus a **$120 surplus buffer**

D is a funded assault reserve rather than the default replacement tier.

## Economy preservation

The accepted formula preserves the established F/E relationship:

- F price-quality contribution: **0**
- E contribution: **1**
- D bounded contribution: **1.5**
- D's full **$80** value still counts toward upkeep

A regression proves a 14-F + 1-E army still receives the same `1/15` rank bonus and `1/15` price-quality bonus as before D existed.

## Latest deployed verification — zero-start / 150-cap follow-up

Exact run `31353827658` tested the protected Vercel preview from HEAD `60ade9918a183e8887f51fd394149eb0a254901f` and passed **13/13** browser tests in about **4.0 minutes** of Playwright execution.

The suite proved:

- a reset produces **0 / 0 musketeers** before autonomous simulation advances
- the **151st musketeer purchase is rejected**
- 150 musketeers form 11 companies while no company exceeds 14
- D remains directly purchasable and earnable
- F/E economy compatibility remains intact from a zero-soldier start
- D Assault Drill still activates only under assault orders
- General AI can build armies autonomously from zero
- treasury, fortress HP, actors, ranks, company sizes, and army sizes remain valid
- fieldwork recruitment blocking/reopening still works
- commander physical return still works
- controlled BREACH still damages fortresses
- Pause / Speed / Front controls still work

### Zero-start D / economy calibration — 4 × 600 seconds

Seeds 31101–31104 all remained valid.

- highest sampled treasury: about **$554.60**
- peak living army size across these samples: **64**
- maximum sampled D share: about **2.86%**
- direct D purchases remained sparse
- earned E→D promotions still occurred
- no army exceeded the 150 cap

### Zero-start natural siege — 9 × 900 seconds

Seeds 31201–31209 all remained valid, and natural fortress conversion remained possible after removing the free starting army.

Notable breakthroughs:

- **Seed 31202:** Left produced **18 fortress hits**, reached about **213.951** minimum BREACH distance, and reduced the Right E fortress from 6500 HP to about **6359.19**. Peak armies were **77 / 78**.
- **Seed 31203:** Left produced **53 fortress hits**, reached about **200.040** minimum BREACH distance, and reduced the Right E fortress from 6500 HP to about **6076.89**. Peak armies were **54 / 54**.

The other sampled seeds produced no fortress hits. The result keeps natural siege possible without requiring either side to approach the 150-soldier ceiling.

## Rejected / corrected evidence

Failed and superseded candidates remain recorded rather than hidden:

1. Universal passive D drill + raw F→D economy normalization — rejected for changing the established E economy and suppressing natural siege.
2. Universal passive D combat advantage with restored F/E economy — still suppressed natural siege and was rejected.
3. Accepted D redesign — Assault Drill is conditional on assault orders and AI D procurement is siege-only funded top-off.
4. First zero-start test run `31353568973` — **12/13 passed**. The sole failure was a test-timing mistake: autonomous AI bought 3 F troops per side before the test clicked Pause. All functional zero-start/cap/long-run scenarios passed. The test was corrected to pause and explicitly reset before inspecting the default state; no gameplay workaround was needed.

## Preserved systems / hard invariants

- 15-phase class roadmap remains intact
- every war's musketeer default is **0 per side**
- maximum **150 musketeers per army**
- maximum **14 musketeers per commander/company**
- commanders do **not** count against the 150-musketeer cap
- global musket base reload remains **30 seconds**
- F permanent melee is not introduced; F melee remains temporary low-power commander counter-charge behavior
- E retains autonomous bayonet charge; D inherits it rather than replacing it
- command remains local and regrouping/commander replacement remains physical
- company command radius 180, individual soldier command radius 350, rejoin completion 285 remain unchanged
- 110-second committed siege baseline and BREACH progress logic remain intact
- fieldwork paid-recruitment blocking remains intact
- fortress progression remains F → E; no D fortress is bundled into v3.0
- Form I remains Shii-Cho; canonical Form II–VII identities are preserved
- only F/E/D are unlocked in Phase 3

## Branch policy

- `main` — accepted/stable baseline
- `agent/current` — the only active development branch

Do not create version-specific development branches. Legacy `update/v2.17`, `update/v2.18`, and `update/v2.19` refs are obsolete cleanup refs and do not drive CI.

## Roadmap

1. **F Class — STABLE**
2. **E Class — STABLE**
3. **D Class — NOW: v3.0 automated verified candidate**
4. **C Class — NEXT CLASS, locked until D stabilizes**
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

- **v3.0:** D foundation / Assault Drill + zero-start / 150-soldier army foundation — automated gate passed
- **v3.1 candidate:** evaluate **Form II — Makashi** as a separate commander-form update after v3.0 is accepted
- before future high ranks become numerous, use the 150-soldier population space to establish healthy rank ecology rather than making every successive class exponentially rarer
- continue cohesion work only when a proposed fix preserves siege continuity

## Verification / acceptance policy

- Failed experiments stay failed in the evidence; acceptance tests are not weakened to make a candidate pass.
- Automated browser evidence proves only the scenarios it actually tests.
- Automated technical failures block advancement.
- After a technically verified update is delivered, **no user comments means accepted/good**.
