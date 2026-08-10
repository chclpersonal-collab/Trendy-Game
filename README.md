# Musketeer Battle Simulator

Autonomous two-army musketeer battle simulation developed on the single rolling branch `agent/current`. Technical completion claims are evidence-gated by the exact deployed Vercel/Playwright build. **Project acceptance convention:** after an update is delivered, no user comments means the update is accepted/good; a separate human-playtest gate is not required.

## Current state

- **Phase 1 / F Class:** STABLE
- **Phase 2 / E Class:** STABLE
- **Phase 3 / D foundation:** STABLE through v3.1.1
- **Current gameplay:** Phase 3 **v3.2 — Form II Makashi + Tactical Combat Continuity**
- **Current frontend:** battle-first interface rework, verified
- **Status:** **AUTOMATED VERIFIED CANDIDATE**
- **Exact verified deployed gameplay HEAD:** `5947664faf28c063618cff6cc201744d26687b2a`
- **Protected Playwright run:** `31374487249` — **27/27 passed**
- **Protected Vercel preview:** `trendy-game-r63j5pfb0-chclpersonal-9731s-projects.vercel.app`
- **Evidence artifact:** `9057493425`
- **Army foundation:** 0 starting musketeers; 150-musketeer hard ceiling per side
- **Adaptive companies:** commanders choose 2–14 soldiers; 11 companies maximum per army
- **Commander Form I / Shii-Cho:** STABLE crowd-oriented baseline
- **Commander Form II / Makashi:** unlocked and automated-verified as the precise anti-commander duel form
- **C Class:** next class candidate; the prior commander-form verification gate is now satisfied

## Phase 3 v3.2 — Makashi + tactical combat continuity

### Bug Fix — Local cross-lane enemy awareness

The screenshot-reported case was reproduced before implementation: a nearby enemy could be horizontally local but vertically separated enough that an allied company continued along its lane without closing to engage.

v3.2 adds a bounded local interception response:

- requires the established local soldier-command relationship; it is not global battlefield awareness
- horizontal relevance is limited to **240** units
- total scan relevance is limited to **310** units
- the company can close vertical separation while remaining leashed to its formation band
- special states such as BREACH, SIEGE, CHARGE, BRACE, VOLLEY, RALLY, and REGROUP are not overridden by cross-lane interception

A dedicated deployed regression starts the enemy outside normal Euclidean musket range and proves the company closes lateral distance and eventually fires.

### Bug Fix — Withdrawal combat continuity

A coordinated retreat is no longer treated as a combat shutdown.

- loaded musketeers can fire while continuing RALLY/rearward movement
- commanders retain danger-close self-defense while withdrawing with their company
- E/D soldiers may use contact bayonet self-defense during a threatened withdrawal
- F soldiers do **not** gain generic melee from this change
- panic/disarm behavior remains separate and unchanged
- rearward-facing movement from v3.1.1 remains intact

### Minor Update — Form II Makashi

Makashi is now the second autonomous commander lightsaber form.

- role: precise **single-target anti-commander duel**
- automatic selection when an isolated enemy commander is the appropriate nearby threat
- higher single-target commander damage than Form I Shii-Cho
- deliberately low crowd utility: when the local fight becomes crowded, the commander returns to Shii-Cho
- does not add disarm
- does not add projectile deflection
- does not replace Shii-Cho as the crowd-defense form

The visible commander label changes to `II` when Makashi is active.

### Efficiency / Complexity Audit

Two optimization experiments were rejected rather than weakening behavior tests:

1. staggered/stale supplemental threat caching reduced target freshness and produced zero fortress hits across the protected nine-seed natural-siege suite
2. reusing an alternate cached combat target also produced zero natural fortress hits across the same suite

Both failed designs were removed. The final verified tree keeps the behaviorally correct v3.2 logic. Despite retaining the direct supplemental scan, the final deployed suite completed in **about 4.0 minutes**, comparable to the prior verified frontend/v3.1.1 gate.

## Frontend rework — battle first

The game screen was audited specifically for generic AI-generated interface patterns and simplified without changing simulation behavior.

### Rework — information hierarchy

The battlefield is the primary surface. The right-side information rail now keeps only live battle information immediately visible:

- troops
- commanders
- treasury
- fortress HP
- kills
- current strategy and plan
- front momentum and held positions
- command integrity
- uncommanded troops
- E/D class counts
- reloading troops
- fortress hits
- wars won

The old player-facing development material was removed from the game screen:

- `Phase 3 Rules`
- the locked `Commander Forms` list
- the 15-phase `Roadmap`
- `General AIs` wording
- release-note-style header copy
- paragraph-length helper/explanation text

The roadmap still exists in the project/runtime and remains part of validation; it is simply no longer presented as gameplay UI.

### Simplification — flat presentation

- Removed the repeated stack of bordered dashboard cards.
- Replaced slash-separated `Left / Right` telemetry with explicit **Left** and **Right** columns.
- Replaced the global monospace UI with the system interface font while retaining tabular numerals for live statistics.
- Removed decorative dashboard chrome: no gradients, glow, pill badges, or rounded-card stacks were introduced.
- Kept the simulation controls as short action labels: **Pause/Resume, Speed, Front, Restart**.
- The battlefield is edge-to-edge inside its play area instead of sitting inside another decorative card.

### Progressive disclosure

Secondary telemetry is preserved under one closed-by-default **Details** disclosure rather than being deleted.

It contains economy, command, fortress, combat, calibration, and seed telemetry. This preserves observability while preventing development/debug information from dominating the normal play view.

### Responsive layout

- Desktop: battlefield + compact information rail.
- Mobile: battlefield first, battle information below it.
- The mobile browser regression verifies no page-level horizontal overflow; horizontal battlefield movement remains contained inside the battlefield scroller.

## Phase 3 v3.1.1 — command continuity

### Commander retreat is not commander death

- An original living commander remains the company's morale/authority source while alive even if temporarily outside the 180-unit tight-proximity radius.
- Detailed tactical soldier orders still require the established 350-unit local soldier-command radius.
- Commander death is the actual command-loss event.
- A replacement commander must physically reach the company before authority and BREACH viability return.

### Coordinated withdrawal

- `RALLY` and rearward `DEFEND` move commander and soldiers together.
- E/D troops do not begin a fresh autonomous bayonet charge during RALLY/REGROUP withdrawal.
- Rearward-moving units face their movement direction instead of moonwalking.
- v3.2 extends this movement model so retreating units can still defend themselves without abandoning the withdrawal.

### Adaptive rebuild thresholds

Rebuild thresholds scale with the commander's chosen 2–14 target size instead of always using the old 4/8 thresholds.

Verified examples:

- target **2** → low **1**, ready **2**
- target **14** → low **4**, ready **8**

### Siege-blocked emergency recovery

When a badly depleted army cannot recruit because a viable enemy BREACH controls its fieldwork, the General reports **`MUSTER BLOCKED`** instead of misleadingly reporting `RECOVER F`. Once the fieldwork is relieved, emergency F recruitment resumes. The established fieldwork logistics blockade remains intact.

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
- only F / E / D soldier ranks are unlocked in Phase 3 v3.2
- individual soldier tactical-command radius **350**
- tight commander/company proximity metric **180**
- soldier rejoin completion radius **285**
- replacement commanders join physically
- fieldwork controls paid reinforcement and is not a forward spawn
- D Assault Drill remains limited to SIEGE / BREACH / commander CHARGE
- commander forms currently unlocked: **I Shii-Cho** and **II Makashi**
- no commander projectile deflection in Forms I–II
- exact 15-phase class roadmap remains intact

## Latest deployed verification

Exact run `31374487249` tested Vercel preview `trendy-game-r63j5pfb0-chclpersonal-9731s-projects.vercel.app` at exact gameplay HEAD `5947664faf28c063618cff6cc201744d26687b2a`.

**Result: 27 / 27 Playwright tests passed in about 4.0 minutes.**

New v3.2 coverage proves:

1. a nearby cross-lane enemy is noticed and the locally commanded company closes vertical distance to engage
2. a loaded musketeer can continue moving backward under RALLY while firing
3. a withdrawing commander retains danger-close self-defense while staying with the company
4. Makashi automatically takes an isolated commander duel and damages only its intended duel target
5. Makashi has stronger single-target commander damage while Shii-Cho remains the crowd form

The previous 22 frontend/v3.1.1 regressions also remained green, covering zero start, max-150, adaptive companies, D progression, F/E economy compatibility, D Assault Drill, commander authority/death, physical replacement joining, rebuild thresholds, MUSTER BLOCKED recovery, controlled BREACH damage, fieldwork recruitment control, movement facing, and player controls.

### Economy audit — 4 × 600 seconds

Seeds 32101–32104 all remained finite and valid.

- peak living army: **61**
- peak companies: **11**
- maximum sampled D share: about **3.70%**
- highest sampled treasury: about **$603.76**
- all company, army, rank, treasury, and fortress invariants remained valid

The prior v3.1.1 high-treasury observation did not reproduce in this v3.2 four-seed sample, but it remains historical evidence rather than being deleted from the changelog.

### Natural-siege audit — 9 × 900 seconds

Seeds 32201–32209 all remained technically valid.

- peak living army: **64**
- peak companies: **11**
- only **seed 32206** produced fortress damage
- Right produced **2 fortress hits**
- minimum Right BREACH-to-fortress distance: about **284.295**
- Left E fortress: **6500 → about 6486.24 HP**
- the other eight seeds produced zero fortress hits

Natural fortress conversion therefore remains possible without restoring the old v3.1 sustained-siege outlier.

## Branch policy

- `main` — accepted/stable baseline
- `agent/current` — the only active development branch

Do not create version-specific development branches. Legacy `update/v2.17`, `update/v2.18`, and `update/v2.19` refs are obsolete cleanup refs and do not drive CI.

## Roadmap

1. **F Class — STABLE**
2. **E Class — STABLE**
3. **D Class — STABLE foundation; v3.2 commander/tactical slice verified**
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
- **NEXT:** C Class as its own isolated rank slice; do not mix Form III into the same implementation
- **LATER:** Form III — **Soresu**, as a separate commander-form slice
- continue tracking siege-blocked treasury accumulation without weakening fieldwork logistics
- preserve healthy future rank ecology: every unlocked rank remains directly buyable and earnable; avoid exponentially vanishing high-rank presence

## Verification / acceptance policy

- Failed experiments stay failed in the evidence; acceptance tests are not weakened to make a candidate pass.
- Automated browser evidence proves only the scenarios it actually tests.
- Automated technical failures block advancement.
- After a technically verified update is delivered, **no user comments means accepted/good**.
