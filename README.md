# Musketeer Battle Simulator

Autonomous two-army musketeer battle simulation developed on the single rolling branch `agent/current`. Technical completion claims are evidence-gated by the exact deployed Vercel/Playwright build. **Project acceptance convention:** after an update is delivered, no user comments means the update is accepted/good; a separate human-playtest gate is not required.

## Current state

- **Phase 1 / F Class:** STABLE
- **Phase 2 / E Class:** STABLE — v2.21 passed 8/8 deployed tests and was accepted with no user comments
- **Current:** Phase 3 **v3.0 — D-Class Foundation / Assault Drill**
- **Status:** **AUTOMATED VERIFIED CANDIDATE**
- **Verified deployed HEAD:** `cfe77f5ab77931f7fe26c7a71323a32a132be33b`
- **Protected Playwright run:** `31352532990` — **12/12 passed**
- **Protected Vercel preview:** `trendy-game-nat3zy2hx-chclpersonal-9731s-projects.vercel.app`
- **Pricing calibration:** 15/15 complete; Phase-2 baseline retained as the starting economy
- **Commander Form I / Shii-Cho:** STABLE
- **Form II / Makashi:** NEXT FORM, deliberately locked during v3.0 so D musketeers can be isolated first

## v3.0 — D-Class Foundation / Assault Drill

The established roadmap defines D as Phase 3 and preserves the rule that every unlocked rank may be bought or earned, but it did not prescribe D's exact price or combat identity. v3.0 therefore introduces one deliberately narrow D mechanic rather than stacking multiple new systems.

### D Class progression

- Direct price: **$80**
- Earned promotion: **E → D at 10 total XP**
- Direct D starts at the **10 XP / D·0 floor**
- Kill bounty: **$40** under the existing 50%-of-rank-price rule
- D inherits E's automatic bayonet charge; no extra bayonet damage is added
- Every earned XP continues to restore **20 HP**, capped at full health

### Assault Drill

D is not a universal passive upgrade over E. Its special musket drill activates only under an assault-oriented company order:

- `SIEGE`
- `BREACH`
- commander `CHARGE`

While the drill is active, D receives:

- **+3.5 percentage points musket aim**
- **2-second reload drill bonus**
- **25-second D reload floor** after veteran effects

Outside those orders, D uses an **E-equivalent veteran combat baseline**. The global musket base reload remains **30 seconds** and F/E behavior is unchanged.

### General AI procurement

The General does not routinely replace F/E troops with D.

- Routine D target outside siege: **0%**
- SIEGE target: up to about **8%**
- D is bought only when the army is within two soldiers of desired strength
- upkeep pressure must be below 78%
- treasury must preserve the normal reserve plus D's $80 price plus a **$120 surplus buffer**

This makes D a funded assault reserve rather than an expensive recovery unit.

## Economy preservation

The first v3.0 candidate normalized the existing F/E price-quality income term across the new raw F→D price span. Although mathematically tidy, this silently reduced E's established quality contribution and the natural-siege regression gate failed. That design was rejected.

The accepted formula preserves the Phase-2 F/E relationship exactly:

- F price-quality contribution: **0**
- E contribution: **1**
- D bounded contribution: **1.5**
- D's full **$80** value still counts toward upkeep

A permanent regression proves a 14-F + 1-E army still receives the same `1/15` rank bonus and `1/15` price-quality bonus as before D existed.

## Final deployed verification

Exact run `31352532990` tested the protected Vercel preview from HEAD `cfe77f5ab77931f7fe26c7a71323a32a132be33b` and passed **12/12** browser tests in about **2.1 minutes** of Playwright execution.

### D / economy calibration — 4 × 600 seconds

Seeds 30101–30104 all remained finite and valid.

- Maximum observed treasury: about **$502.27**
- Maximum sampled D army share: about **4.65%**
- Direct D purchases occurred only sparsely
- E→D battlefield promotions also occurred naturally
- Fortress HP, treasury, company cap, unlocked ranks, and 15-phase roadmap remained valid

### Natural siege — Phase 3 acceptance

The old Phase-2 deterministic trio 21901–21903 no longer reproduces the exact v2.21 breakthrough after D-era mechanics are enabled. It is retained as comparison telemetry, not hidden or rewritten.

Phase 3 therefore uses a broader nine-seed × 600-second natural-siege acceptance sample, seeds 30201–30209. All nine runs remained valid, and **seed 30209 produced a natural breakthrough**:

- Left fortress hits: **2**
- minimum Left BREACH-to-fortress distance: about **213.900**
- Right E fortress HP: **6500 → about 6482.35**
- final living D troops: **1 / 1**

The other eight acceptance seeds produced zero fortress hits. This proves natural fortress conversion remains possible without making siege routine.

### Other deployed regressions

The final gate also proves:

- D is directly purchasable for $80 and earnable at 10 total XP
- D is E-equivalent outside assault orders and gains its drill under SIEGE
- General AI refuses routine D procurement but may choose D for a funded SIEGE top-off
- F/E economy quality remains Phase-2 compatible
- deterministic 300-second Phase-3 self-play remains finite
- separated commanders still return physically without restoring command early
- fieldwork BREACH still blocks paid recruitment and relief reopens it
- controlled BREACH still damages fortresses
- Pause / Speed / Front controls still work
- canonical Form I–VII identities remain intact

## Rejected v3.0 experiments

Failed candidates remain part of the project evidence:

1. **Universal passive D drill + raw F→D economy normalization** — rejected after the first deployed run failed natural siege and the normalization was shown to nerf E's established economy.
2. **Restored F/E economy + universal passive D combat advantage** — still suppressed natural fortress conversion; a broader nine-seed audit confirmed the problem was structural rather than one unlucky deterministic trio.
3. **Accepted redesign:** D's special advantage became assault-dependent and AI procurement became siege-only funded top-off. This restored natural fortress conversion in the broader Phase-3 acceptance sample.

## Preserved systems / hard invariants

- 15-phase class roadmap remains intact
- maximum **14 musketeers per commander/company** and **56 per army**
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
4. **C Class — NEXT CLASS, locked until D is accepted/stabilized**
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

- **v3.0:** D foundation / Assault Drill — automated gate passed; awaiting normal user acceptance convention
- **v3.1 candidate:** evaluate **Form II — Makashi** as a separate commander-form update after v3.0 is accepted; do not combine it with D's first balance sample
- continue cohesion work only when a proposed fix preserves siege continuity; high uncommanded telemetry by itself is not a sufficient reason to change command behavior

## Verification / acceptance policy

- Failed experiments stay failed in the evidence; acceptance tests are not weakened to make a candidate pass.
- Automated browser evidence proves only the scenarios it actually tests.
- Automated technical failures block advancement.
- After a technically verified update is delivered, **no user comments means accepted/good**.
