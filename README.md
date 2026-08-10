# Musketeer Battle Simulator

Autonomous two-army musketeer battle simulation developed on the single rolling branch `agent/current`. Technical completion claims are evidence-gated by the exact deployed Vercel/Playwright build. **Project acceptance convention:** after an update is delivered, no user comments means the update is accepted/good; a separate human-playtest gate is not required.

## Current state

- **Phase 1 / F Class:** STABLE
- **Phase 2 / E Class:** STABLE
- **Phase 3 / D foundation:** STABLE
- **Current gameplay:** Phase 3 **v3.2.1 — Rank Ecology / Elite Siege Discipline**
- **Current frontend:** battle-first interface rework, verified
- **Status:** **AUTOMATED VERIFIED CANDIDATE**
- **Exact verified deployed gameplay HEAD:** `906df2d8d21950396d442deb08046609fbea19e2`
- **Protected Playwright run:** `31378905265` — **30/30 passed**
- **Protected Vercel preview:** `trendy-game-qpdpbwah9-chclpersonal-9731s-projects.vercel.app`
- **Evidence artifact:** `9059201788`
- **Evidence SHA256:** `0008d9f5eed07d4c82683530a409b94917ab64a6e1ee15a2513816c6d7d01299`
- **Army foundation:** 0 starting musketeers; 150-musketeer hard ceiling per side
- **Adaptive companies:** commanders choose 2–14 soldiers; 11 companies maximum per army
- **Rank ecology:** F majority / E regular / D rare-visible
- **Commander Form I / Shii-Cho:** STABLE crowd-oriented baseline
- **Commander Form II / Makashi:** unlocked and verified as the precise anti-commander duel form
- **C Class:** next isolated class candidate after v3.2.1 acceptance

## Phase 3 v3.2.1 — rank ecology / elite siege discipline

### Balance Rework — F majority, E regular, D rare-visible

The previous procurement model treated E and D as one combined elite pool and allowed routine D purchasing only during SIEGE. User playtesting showed the practical result: E could be sparse and D could be absent for long periods even in mature armies.

v3.2.1 separates E and D into independent procurement layers:

- E target share: **18% BUILD / 18% DEFEND / 20% CONTEST / 24% ATTACK / 26% SIEGE**
- D target share: **3% BUILD / 3% DEFEND / 4% CONTEST / 5% ATTACK / 6% SIEGE**
- non-SIEGE D purchasing begins only once an army has at least **18** musketeers
- the established funded SIEGE D top-off remains available from **12** musketeers
- recovery below 7 musketeers remains F-first
- E and D each have their own share target; D no longer substitutes for the E layer
- F remains the intended majority rather than being displaced by elites

This is an intentional classified retirement of the old v3.0 **routine D outside SIEGE = 0%** procurement restriction. D remains rare, but is no longer designed to be practically mythical.

### Preserved progression and economy

The ecology patch does **not** make elites common by weakening progression or combat costs:

- F→E remains **4 earned XP**
- E→D remains **10 total XP**
- XP healing remains **+20 HP per earned XP**
- prices remain **F $10 / E $32 / D $80**
- bounty remains **50% of defeated-rank price**
- passive income remains **$10/s**
- living-army upkeep remains **1.60% of army value/s**
- D remains E-equivalent outside its established Assault Drill conditions
- D Assault Drill remains restricted to SIEGE / BREACH / commander CHARGE

### Bug Fix / Command Rework — Elite Siege Discipline

The first ecology candidate revealed an existing order conflict: E/D autonomous bayonet initiation is evaluated before BREACH-specific movement. With many more living E/D soldiers, a siege spearhead gained many more opportunities to abandon its explicit BREACH press for an autonomous bayonet charge.

v3.2.1 therefore applies the same type of command discipline already used by BRACE/RALLY:

- an E/D soldier under explicit **SIEGE or BREACH** does not start a fresh autonomous bayonet charge
- a charge already in progress may finish
- ordinary E/D autonomous bayonet behavior outside SIEGE/BREACH is unchanged
- D Assault Drill can therefore operate under the siege orders it was designed for instead of being repeatedly pre-empted by a fresh charge

A focused deployed regression verifies both halves: no fresh charge under BREACH, and autonomous charge still starts under ordinary ADVANCE combat.

### Rank-ecology measurement — 600 seconds

Dedicated seed `34202` sampled both mature armies every 30 seconds after the opening 120 seconds.

Across **32 mature-army samples**:

- mean E share: **17.53%**
- mean D share: **2.96%**
- mean combined E+D share: **20.49%**
- maximum combined elite share: **30%**
- D was present in **75%** of mature-army samples
- cumulative direct buys: Left **102 F / 32 E / 5 D**, Right **134 F / 36 E / 5 D**

This is evidence for the intended pyramid in the tested sample: roughly four-fifths common F troops, a meaningful E veteran layer, and a small but recurring D layer.

### Rejected first candidate

Run `31378197525` is retained as failed evidence.

- rank ecology itself passed: mean E **15.31%**, mean D **2.80%**, D present in **68.75%** of mature samples
- one UI regression still expected the old `v3.2` badge
- more importantly, **all nine protected 900-second natural-siege seeds produced zero fortress hits**
- the siege acceptance gate was not weakened

The stale UI assertion was updated to `v3.2.1`. The gameplay failure led to the Elite Siege Discipline fix above.

## Phase 3 v3.2 — Makashi + tactical combat continuity

### Bug Fix — Local cross-lane enemy awareness

A nearby enemy can be horizontally local but vertically separated enough that an allied company would previously continue along its lane without closing to engage.

v3.2 adds bounded local interception:

- requires the established local soldier-command relationship; it is not global battlefield awareness
- horizontal relevance is limited to **240** units
- total scan relevance is limited to **310** units
- vertical interception remains leashed to the company's formation band
- BREACH, SIEGE, CHARGE, BRACE, VOLLEY, RALLY, REGROUP, and active rearward movement are not overridden

### Bug Fix — Withdrawal combat continuity

- loaded musketeers can fire while continuing RALLY/rearward movement
- commanders retain danger-close self-defense while withdrawing with their company
- E/D soldiers may use contact bayonet self-defense during a threatened withdrawal
- F soldiers do **not** gain generic melee
- panic/disarm behavior remains separate
- rearward-facing movement from v3.1.1 remains intact

### Minor Update — Form II Makashi

Makashi is the second autonomous commander lightsaber form.

- precise single-target anti-commander duel role
- automatic selection for an appropriate isolated commander duel
- stronger single-target commander damage than Shii-Cho
- low crowd utility; crowded local fights return to Shii-Cho
- no disarm
- no projectile deflection

### Efficiency / Complexity Audit

Two v3.2 target-scan optimization experiments were rejected after each produced zero fortress hits across the protected nine-seed siege suite. Both failed designs remain absent from the final tree. The accepted v3.2 build completed its full deployed suite in about 4.0 minutes.

## Frontend rework — battle first

The battlefield is the primary surface. The right-side information rail keeps live battle information immediately visible while advanced telemetry is placed under one closed-by-default **Details** disclosure.

The old player-facing development material was removed from the gameplay screen: `Phase 3 Rules`, locked `Commander Forms`, the 15-phase `Roadmap`, `General AIs` wording, release-note header copy, and paragraph-length helper prose. The project/runtime roadmap still exists and is validated; it is simply not normal gameplay UI.

The interface uses explicit Left/Right columns, a system UI font with tabular numerals for statistics, no decorative card stack, and responsive desktop/mobile layouts. The existing **Pause/Resume, Speed, Front, Restart** controls remain intact.

## Phase 3 v3.1.1 — command continuity

### Commander retreat is not commander death

- an original living commander remains the company's morale/authority source while alive even if temporarily outside the 180-unit tight-proximity radius
- detailed tactical soldier orders still require the established 350-unit local soldier-command radius
- commander death is the actual command-loss event
- a replacement commander must physically reach the company before authority and BREACH viability return

### Coordinated withdrawal

- RALLY and rearward DEFEND move commander and soldiers together
- E/D troops do not begin a fresh autonomous bayonet charge during RALLY/REGROUP withdrawal
- rearward-moving units face their movement direction instead of moonwalking
- v3.2 allows threatened withdrawing units to defend themselves without abandoning the withdrawal

### Adaptive rebuild thresholds

Rebuild thresholds scale with the commander's chosen 2–14 target size rather than fixed 4/8 thresholds. Examples: target 2 → low 1 / ready 2; target 14 → low 4 / ready 8.

### Siege-blocked emergency recovery

When a badly depleted army cannot recruit because a viable enemy BREACH controls its fieldwork, the General reports **MUSTER BLOCKED**. Once the fieldwork is relieved, emergency F recruitment resumes. The fieldwork logistics blockade remains intact.

## Core gameplay invariants

- fresh war: **0 musketeers per side**
- maximum: **150 musketeers per army**
- commanders are separate from the 150-musketeer count
- commander/company target: **2–14 soldiers**
- hard company maximum: **14 living musketeers**
- hard army company maximum: **11**
- F price **$10**, E **$32**, D **$80**
- passive income **$10/s**
- bounty rate **50% of defeated musketeer rank price**
- living-army upkeep **1.60% of army value/s**
- musket base reload **30 seconds**
- veteran minimum reload **27 seconds**
- D Assault Drill minimum **25 seconds** only under its assault-order conditions
- F→E at **4 XP**
- E→D at **10 XP**
- every earned XP restores **20 HP**, capped at full health
- only F / E / D soldier ranks are unlocked in Phase 3 v3.2.1
- individual soldier tactical-command radius **350**
- tight commander/company proximity metric **180**
- soldier rejoin completion radius **285**
- replacement commanders join physically
- fieldwork controls paid reinforcement and is not a forward spawn
- commander forms currently unlocked: **I Shii-Cho** and **II Makashi**
- no commander projectile deflection in Forms I–II
- exact 15-phase class roadmap remains intact

The previous D procurement restriction is the one intentionally changed invariant in v3.2.1: D is no longer routine-SIEGE-only once a mature army exists.

## Latest deployed verification

Exact run `31378905265` tested Vercel preview `trendy-game-qpdpbwah9-chclpersonal-9731s-projects.vercel.app` at exact gameplay HEAD `906df2d8d21950396d442deb08046609fbea19e2`.

**Result: 30 / 30 Playwright tests passed in about 5.1 minutes.**

New v3.2.1 coverage proves:

1. E and D procurement use independent ecology targets
2. a mature non-SIEGE force can select a rare D purchase
3. the established early SIEGE D top-off remains available
4. SIEGE/BREACH suppresses only fresh autonomous elite charges, while ordinary autonomous bayonet behavior remains
5. the 600-second ecology sample satisfies the minimum E/D-presence and F-majority gates

All previous v3.2/frontend/v3.1.1 technical regressions remained green.

### Economy audit — 4 × 600 seconds

Seeds 32101–32104 all remained finite and valid.

- peak living army: **57**
- peak companies: **11**
- highest sampled treasury: about **$603.76**
- maximum sampled instantaneous D share: **12%**
- no negative treasury, invalid rank, fortress bound, army-cap, company-cap, or finite-value failure occurred

The dedicated ecology sample is the better frequency measure because the older economy audit records maxima rather than time-averaged rank shares.

### Natural-siege audit — 9 × 900 seconds

Seeds 32201–32209 all remained technically valid.

- peak living army: **71**
- peak companies: **11**
- **seed 32201:** Right produced **4 fortress hits**, minimum Right BREACH distance about **214.104**, Left E fortress **6500 → about 6467.94 HP**
- **seed 32206:** Right produced **6 fortress hits**, minimum Right BREACH distance about **191.539**, Left F fortress **4500 → about 4449.17 HP**
- total fortress hits across the suite: **10**
- the other seven seeds produced zero fortress hits

Natural fortress conversion therefore remains possible and the old v3.1 117-hit sustained-siege outlier did not return in this sample.

## Branch policy

- `main` — accepted/stable baseline
- `agent/current` — the only active development branch

Do not create version-specific development branches. Legacy `update/v2.17`, `update/v2.18`, and `update/v2.19` refs are obsolete cleanup refs and do not drive CI.

## Roadmap

1. **F Class — STABLE**
2. **E Class — STABLE**
3. **D Class — STABLE foundation; v3.2.1 ecology verified candidate**
4. **C Class — NEXT CLASS**
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

- **DONE:** v3.1.1 Command Continuity / Coordinated Withdrawal
- **DONE:** battle-first frontend rework / anti-generic-UI cleanup
- **DONE:** v3.2 Form II Makashi + tactical combat continuity
- **DONE:** v3.2.1 rank ecology + Elite Siege Discipline
- **NEXT:** C Class as its own isolated rank slice; do not mix Form III into the same implementation
- **LATER:** Form III — **Soresu**, as a separate commander-form slice
- continue tracking siege-blocked treasury accumulation without weakening fieldwork logistics
- carry the v3.2.1 rank-ecology policy forward: every unlocked rank remains directly buyable and earnable, with higher ranks rare but not exponentially absent

## Verification / acceptance policy

- Failed experiments stay failed in the evidence; acceptance tests are not weakened to make a candidate pass.
- Automated browser evidence proves only the scenarios it actually tests.
- Automated technical failures block advancement.
- After a technically verified update is delivered, **no user comments means accepted/good**.
