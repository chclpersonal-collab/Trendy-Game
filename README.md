# Musketeer Battle Simulator

Autonomous two-army musketeer battle simulation developed on the single rolling branch `agent/current`. Technical completion claims are evidence-gated by the exact deployed Vercel/Playwright build. **Project acceptance convention:** after an update is delivered, no user comments means the update is accepted/good; a separate human-playtest gate is not required.

## Current state

- **Phase 1 / F Class:** STABLE
- **Phase 2 / E Class:** STABLE
- **Phase 3 / D foundation:** STABLE
- **Phase 3 v3.2.1 rank ecology:** STABLE / accepted
- **Phase 4 / C Class v3.3:** STABLE / accepted
- **Current gameplay:** Phase 4 **v3.3.1 — Force Factors / Stats Semantics Audit**
- **Status:** **AUTOMATED VERIFIED CANDIDATE**
- **Exact verified deployed gameplay/test HEAD:** `fe1315b0e2e9116cfe77d890ffcde3cfb6de07bd`
- **Protected Playwright run:** `31454787299` — **36/36 passed**
- **Protected Vercel preview:** `trendy-game-8peh7qs6v-chclpersonal-9731s-projects.vercel.app`
- **Evidence artifact:** `9087713696`
- **Evidence SHA256:** `ed3379759feaba52f143625f31866ae2b388c032b1eeddb4011e8e810f55a699`
- **Army foundation:** 0 starting musketeers; 150-musketeer hard ceiling per side
- **Adaptive companies:** commanders choose 2–14 soldiers; 11 companies maximum per army
- **Rank ecology:** F majority / E regular / D rare-visible / C scarce-recurring
- **Commander Form I / Shii-Cho:** STABLE crowd-oriented baseline
- **Commander Form II / Makashi:** verified precise anti-commander duel form
- **B Class:** next isolated soldier-rank candidate after v3.3.1 acceptance
- **Form III / Soresu:** later, isolated from B Class

## Phase 4 v3.3.1 — Force Factors / Stats Semantics Audit

### Screenshot-driven stats audit

The user-provided v3.3 screenshot at about 1936 simulation seconds showed several reasons the existing raw totals could be misread:

- Left had **58 troops** versus Right **51**, but Left also had **16 reloading** versus Right **1**. Raw troop count therefore overstated Left's immediately available musket fire.
- The old **Command 100%** label represented company command authority, not the separate 350-unit local tactical-command relationship used for detailed soldier orders.
- The elite snapshot was sparse: Left **3 E / 0 D / 0 C** and Right **3 E / 1 D / 0 C**. This is recorded as an observation only; one screenshot is not enough evidence to rebalance the accepted rank ecology.
- `ATTACK` alongside `HOLD UPKEEP` is not contradictory: Strategy is battlefield posture while the spending plan is an economic decision. The UI now labels the latter **Budget**.
- The screenshot made the Right Positions value look absent. The deployed regression confirms the DOM maintains both Left and Right position values, including explicit zero; no missing-data bug reproduced.

### Minor Update / Telemetry Rework — five force factors

The Forces panel now exposes five **derived 0–100 telemetry factors**. They summarize mechanics that already exist and have **no gameplay effect** themselves.

- **Offense:** rank quality + firing readiness + local tactical command
- **Defense:** health + rank resilience + command authority + actual battlefield cover
- **Stamina:** health + firing readiness + company cohesion
- **Skill:** rank / earned XP + local tactical command + company cohesion
- **Luck:** actual musket hits compared with the simulator's predicted hit probabilities; **50 is neutral**

Luck uses expected accuracy and observed hit results with sample-size shrinkage, so a few early shots do not immediately produce an extreme score. It currently measures musket RNG only rather than melee, fortress-fire, or every random event in the simulation.

### UI semantics bug fix / clarification

- **Command** → **Authority**
- added **Local command** as a separate percentage
- **Uncommanded** → **No authority**
- **Plan** → **Budget**
- Offense / Defense / Stamina / Skill / Luck are visible in the Forces section
- empty-army command percentages display `—` rather than a misleading 100%

### Preserved gameplay

The force factors are read-only telemetry. v3.3.1 does not change:

- hit probability
- damage
- reload timing
- movement
- rank progression or procurement
- economy or upkeep
- company command behavior
- fortress mechanics
- C Volley Drill
- Makashi / Shii-Cho behavior

### Rejected first v3.3.1 verification

Run `31454418767` finished **35/36**.

- all three new force-factor tests passed
- C ecology, economy and natural-siege audits passed
- the sole failure was a legacy UI assertion requiring the badge to equal exactly `v3.3` instead of the correct `v3.3.1`
- the stale assertion was advanced; no gameplay formula, factor weight, RNG behavior, or acceptance threshold changed
- rejected-run artifact: `9087599284`
- rejected-run SHA256: `7e952055b0c51cfc0eb8e9581472c4b730355ad4a202f9beefe8e5479a1093e8`

### Final deployed verification

Exact run `31454787299` tested Vercel preview `trendy-game-8peh7qs6v-chclpersonal-9731s-projects.vercel.app` at exact gameplay/test HEAD `fe1315b0e2e9116cfe77d890ffcde3cfb6de07bd`.

**Result: 36 / 36 Playwright tests passed in about 5.3 minutes.**

New v3.3.1 coverage verifies:

1. all five factors are finite and remain within 0–100
2. initial Luck is neutral at 50
3. Authority and Local command are distinct UI/state concepts
4. both Left and Right Positions values remain present, including explicit zero
5. a controlled all-reloading force has lower Offense and Stamina than an otherwise comparable ready force
6. Luck moves above/below 50 when observed musket hits outperform/underperform predicted accuracy
7. `forceFactorModel.gameplayEffect` remains false
8. all previous C, E/D ecology, Makashi, command continuity, fieldwork, BREACH, max-150, adaptive-company and UI gates remain green

The long-run economy and siege telemetry reproduced the v3.3 candidate exactly, providing evidence that the factor instrumentation did not perturb simulation RNG or gameplay.

### Economy audit — 4 × 600 seconds

Seeds 32101–32104 remained finite and valid with the same v3.3 values:

- peak living army: **57**
- peak companies: **10**
- highest sampled treasury: about **$603.76**
- maximum instantaneous D share: **12%**
- three direct C purchases across the eight sampled army-sides
- no force-factor, treasury, rank, fortress, army-cap, company-cap or finite-value failure

### Natural-siege audit — 9 × 900 seconds

Seeds 32201–32209 remained technically valid with the same v3.3 values:

- peak living army: **71**
- peak companies: **11**
- only seed **32206** produced fortress damage
- Left produced **27 fortress hits**
- Right E fortress: **6500 → about 6278.96 HP**
- other eight seeds: zero fortress hits

The 27-hit seed remains a monitoring observation rather than perfect-balance proof.

## Phase 4 v3.3 — C Class / Volley Drill

C is the fourth unlocked soldier rank and remains directly buyable or earnable in combat.

- direct price: **$150**
- D → C promotion: **18 total XP**
- progression thresholds: **4 → 10 → 18 XP**
- every earned XP restores **20 HP**, capped at full health
- C inherits E autonomous bayonet capability
- C inherits D Assault Drill
- C Volley Drill activates only during commander-issued formal `VOLLEY`
- Volley Drill: **+4.5 percentage points aim**, **2.5 seconds faster reload**, **24.5-second minimum reload**
- C target shares remain **1.5–2.5%**, with minimum army 24 and a healthy E/D foundation required for direct AI procurement

The intended hierarchy remains **F common → E regular → D rare-visible → C scarce-recurring**.

## Core gameplay invariants

- fresh war: **0 musketeers per side**
- maximum: **150 musketeers per army**
- commanders are separate from the 150-musketeer count
- commander/company target: **2–14 soldiers**
- hard company maximum: **14 living musketeers**
- hard army company maximum: **11**
- prices: **F $10 / E $32 / D $80 / C $150**
- passive income: **$10/s**
- bounty: **50% of defeated musketeer rank price**
- living-army upkeep: **1.60% of army value/s**
- musket base reload: **30 seconds**
- F/E veteran minimum reload: **27 seconds**
- D Assault Drill minimum: **25 seconds** under established assault orders
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

## Branch policy

- `main` — accepted/stable baseline
- `agent/current` — the only active development branch

Do not create version-specific development branches. Legacy `update/v2.17`, `update/v2.18`, and `update/v2.19` refs remain obsolete cleanup refs and do not drive CI.

## Roadmap

1. **F Class — STABLE**
2. **E Class — STABLE**
3. **D Class — STABLE**
4. **C Class — STABLE**
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
- **DONE / STABLE:** v3.3 C Class / Volley Drill
- **NOW:** v3.3.1 Force Factors / Stats Semantics Audit — automated verified candidate
- **NEXT:** B Class as its own isolated soldier-rank slice after v3.3.1 acceptance
- **LATER:** Form III — **Soresu**, isolated from B Class
- **MONITOR:** the 27-hit seed32206 siege observation without weakening fieldwork logistics or the natural-siege gate
- **MONITOR:** elite sparsity from user screenshots across repeated observations before changing the accepted ecology
- preserve healthy future rank ecology: every unlocked rank remains directly buyable and earnable; avoid exponential XP/price growth that makes high ranks practically absent

## Verification / acceptance policy

- Failed experiments stay failed in the evidence; acceptance tests are not weakened to make a candidate pass.
- Automated browser evidence proves only the scenarios it actually tests.
- Automated technical failures block advancement.
- After a technically verified update is delivered, **no user comments means accepted/good**.
