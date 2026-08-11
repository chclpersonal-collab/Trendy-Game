# Musketeer Battle Simulator

Autonomous two-army musketeer battle simulation developed on the single rolling branch `agent/current`. Technical completion claims are evidence-gated by the exact deployed Vercel/Playwright build. **Project acceptance convention:** after an update is delivered, no user comments means the update is accepted/good; a separate human-playtest gate is not required.

## Current state

- **Phase 1 / F Class:** STABLE
- **Phase 2 / E Class:** STABLE
- **Phase 3 / D foundation:** STABLE
- **Phase 3 v3.2.1 rank ecology:** STABLE / accepted
- **Current gameplay:** Phase 4 **v3.3 — C Class / Volley Drill**
- **Current frontend:** battle-first interface rework, verified
- **Status:** **AUTOMATED VERIFIED CANDIDATE**
- **Exact verified deployed gameplay HEAD:** `a0e217657fb505e2884ab8619a7a0e1285371722`
- **Protected Playwright run:** `31452686999` — **33/33 passed**
- **Protected Vercel preview:** `trendy-game-4bg0pkab8-chclpersonal-9731s-projects.vercel.app`
- **Evidence artifact:** `9086965631`
- **Evidence SHA256:** `b9065ab3ca24ebc981b3c811cf44236e4165d27ea376b0b04971e734dc95b52a`
- **Army foundation:** 0 starting musketeers; 150-musketeer hard ceiling per side
- **Adaptive companies:** commanders choose 2–14 soldiers; 11 companies maximum per army
- **Rank ecology:** F majority / E regular / D rare-visible / C scarce-recurring
- **Commander Form I / Shii-Cho:** STABLE crowd-oriented baseline
- **Commander Form II / Makashi:** verified precise anti-commander duel form
- **B Class:** next isolated soldier-rank candidate after v3.3 acceptance
- **Form III / Soresu:** later, isolated from B Class

## Phase 4 v3.3 — C Class / Volley Drill

### Major Update — C Class

C is the fourth unlocked soldier rank. It follows the existing dual-path progression rule: every unlocked rank can be **bought directly or earned in combat**.

- direct price: **$150**
- D → C promotion: **18 total XP**
- progression thresholds therefore grow additively: **4 → 10 → 18 XP**
- each earned XP still restores **20 HP**, capped at full health
- C inherits E's autonomous bayonet capability
- C inherits D's Assault Drill under SIEGE / BREACH / commander CHARGE
- C does not receive a large always-on raw-stat jump simply because its XP floor is 18
- C uses the same ordinary strategic weight as D; its new advantage is tactical specialization

The 18-XP threshold intentionally avoids exponential progression. Higher ranks are meant to be rarer, not effectively absent from normal wars.

### Minor Update / Combat Rework — Volley Drill

C's unique mechanic is **formal Volley Drill**. It activates only when a C musketeer fires as part of a commander-issued formal `VOLLEY`.

During that formal volley:

- **+4.5 percentage points** musket aim
- **2.5 seconds faster** reload
- **24.5-second minimum** reload floor

Outside a formal volley, those C-specific bonuses are inactive. HOLD, DEFEND and BRACE do not silently activate Volley Drill. This keeps C's identity narrow and prevents it from becoming a passive universal upgrade.

### Rank Ecology Rework — scarce but recurring C

C procurement is layered on top of the accepted v3.2.1 E/D ecology rather than replacing it.

C target shares:

- BUILD: **1.5%**
- DEFEND: **2.5%**
- CONTEST: **2.0%**
- ATTACK: **2.5%**
- SIEGE: **1.5%**

General AI considers a direct C purchase only when:

- the army has at least **24 musketeers**
- the E and D foundation is already sufficiently healthy
- upkeep pressure is below **84%**
- the protected reserve remains affordable after the $150 purchase
- established E/D procurement does not currently have higher priority

This preserves the hierarchy **F common → E regular → D rare-visible → C scarce-recurring**.

### C ecology measurement — 600 seconds

Seed `35304` produced **29 mature-army samples** after the opening period:

- mean E share: **17.22%**
- mean D share: **4.51%**
- mean C share: **0.91%**
- mean combined E+D+C share: **22.64%**
- C was present in **24.14%** of mature-army samples
- at least one direct C purchase occurred naturally
- the final instant happened to contain **0 C / 0 C**, showing that C remains mortal and scarce rather than permanently guaranteed

The evidence supports the intended behavior in this deterministic sample: C appears often enough to participate, but remains far rarer than E or D.

### Test Maintenance — rejected first v3.3 verification

Run `31452237019` finished **31/33** and is retained as failed evidence.

The gameplay itself remained technically bounded and the C ecology sample already showed mean C about **0.91%** with **24.14%** presence. The two failures were test assumptions:

1. the deterministic C-procurement setup accidentally triggered the already-established wealthy-E top-off before C eligibility;
2. one core metadata test still hard-coded v3.2 / Phase 3 / F-E-D-only expectations.

The setup was corrected to represent an actually completed E/D foundation and the stale metadata assertions were advanced to Phase 4. No C balance threshold was weakened and no gameplay workaround was added.

## Preserved systems

### v3.2.1 rank ecology / Elite Siege Discipline

- E and D remain independent procurement layers.
- E targets remain 18–26% by stance.
- D targets remain 3–6% by stance.
- Mature non-SIEGE forces may buy rare D troops.
- The funded early SIEGE D top-off remains available.
- Fresh autonomous E/D bayonet starts do not override explicit SIEGE/BREACH orders.
- F→E remains 4 XP and E→D remains 10 XP.

### v3.2 commander combat

- Form I Shii-Cho remains the crowd-oriented commander baseline.
- Form II Makashi remains the precise isolated anti-commander duel form.
- No projectile deflection exists in Forms I–II.
- Cross-lane awareness remains locally bounded rather than global.
- Coordinated withdrawal can continue fighting without abandoning retreat movement.

### v3.1.1 command continuity

- living commander retreat/separation is not commander death
- detailed tactical orders still require the 350-unit soldier command radius
- tight company proximity remains a separate 180-unit metric
- commander death is the real command-loss event
- replacement commanders must physically join before restoring authority/BREACH viability
- RALLY/rearward DEFEND move commander and troops together
- rearward movers face their actual movement direction
- adaptive rebuild thresholds scale with 2–14 chosen company size
- `MUSTER BLOCKED` remains the correct state when enemy BREACH prevents paid recruitment at fieldwork

## Core gameplay invariants

- fresh war: **0 musketeers per side**
- maximum: **150 musketeers per army**
- commanders are separate from the 150-musketeer count
- company target: **2–14 soldiers**
- hard company maximum: **14 living musketeers**
- hard army company maximum: **11**
- prices: **F $10 / E $32 / D $80 / C $150**
- passive income: **$10/s**
- bounty: **50% of defeated musketeer rank price**
- living-army upkeep: **1.60% of army value/s**
- musket base reload: **30 seconds**
- veteran minimum reload: **27 seconds**
- D Assault Drill minimum: **25 seconds** under assault-order conditions only
- C Volley Drill minimum: **24.5 seconds** during formal VOLLEY only
- F→E: **4 XP**
- E→D: **10 XP**
- D→C: **18 XP**
- each earned XP restores **20 HP**, capped at full health
- currently unlocked soldier ranks: **F / E / D / C only**
- soldier tactical-command radius: **350**
- tight commander/company proximity metric: **180**
- soldier rejoin completion radius: **285**
- replacement commanders join physically
- fieldwork controls paid reinforcement and is not a forward spawn
- commander forms currently unlocked: **I Shii-Cho / II Makashi**
- exact 15-phase class roadmap remains intact

## Latest deployed verification

Exact run `31452686999` tested Vercel preview `trendy-game-4bg0pkab8-chclpersonal-9731s-projects.vercel.app` at exact gameplay HEAD `a0e217657fb505e2884ab8619a7a0e1285371722`.

**Result: 33 / 33 Playwright tests passed in about 5.2 minutes.**

New v3.3 coverage proves:

1. direct C purchase costs $150 and begins at C·0 / 18 total XP
2. a D soldier promotes to C at 18 total XP while preserving +20 HP earned-XP healing
3. Volley Drill activates for formal volley fire and not as a passive always-on bonus
4. C procurement waits for a mature E/D foundation
5. the 600-second C ecology sample keeps C scarce while naturally present
6. all previous v3.2.1 rank ecology, siege discipline, Makashi, command continuity, UI, zero-start, max-150, company-size, fieldwork and BREACH regressions remain green

### Economy audit — 4 × 600 seconds

Seeds 32101–32104 all remained finite and valid.

- peak living army: **57**
- peak companies: **10**
- highest sampled treasury: about **$603.76**
- maximum instantaneous D share: **12%**
- three direct C purchases occurred across the eight sampled army-sides
- no negative treasury, invalid rank, fortress-bound, army-cap, company-cap or finite-value failure occurred

### Natural-siege audit — 9 × 900 seconds

Seeds 32201–32209 all remained technically valid.

- peak living army: **71**
- peak companies: **11**
- only seed **32206** produced fortress damage
- Left produced **27 fortress hits**
- Right E fortress: **6500 → about 6278.96 HP**
- total fortress hits: **27**
- the other eight seeds produced zero hits

This is higher than v3.2.1's 10-hit protected sample, so it remains a **monitoring observation**, not a claim of perfect siege balance. It remains far below the rejected v3.1 sustained-siege outlier of 117 hits, and the current protected acceptance gate confirms natural siege remains possible without a technical invariant failure.

## Branch policy

- `main` — accepted/stable baseline
- `agent/current` — the only active development branch

Do not create version-specific development branches. Legacy `update/v2.17`, `update/v2.18`, and `update/v2.19` refs remain obsolete cleanup refs and do not drive CI.

## Roadmap

1. **F Class — STABLE**
2. **E Class — STABLE**
3. **D Class — STABLE**
4. **C Class — NOW: v3.3 automated verified candidate**
5. **B Class — NEXT CLASS**
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

### Near-term roadmap

- **DONE:** v3.1.1 Command Continuity / Coordinated Withdrawal
- **DONE:** battle-first frontend rework
- **DONE:** v3.2 Form II Makashi + tactical combat continuity
- **DONE / STABLE:** v3.2.1 rank ecology + Elite Siege Discipline
- **NOW:** v3.3 C Class / Volley Drill — automated verified candidate
- **NEXT:** B Class as its own isolated soldier-rank slice after v3.3 acceptance
- **LATER:** Form III — **Soresu**, isolated from B Class
- **MONITOR:** the 27-hit seed32206 siege observation without weakening fieldwork logistics or the natural-siege gate
- preserve healthy future rank ecology: every unlocked rank remains directly buyable and earnable; avoid exponential XP/price growth that makes high ranks practically absent

## Verification / acceptance policy

- Failed experiments stay failed in the evidence; acceptance tests are not weakened to make a candidate pass.
- Automated browser evidence proves only the scenarios it actually tests.
- Automated technical failures block advancement.
- After a technically verified update is delivered, **no user comments means accepted/good**.
