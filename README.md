# Musketeer Battle Simulator

Autonomous two-army musketeer battle simulation developed on the single rolling branch `agent/current`. Technical completion claims are evidence-gated by the exact deployed Vercel/Playwright build. **Project acceptance convention:** after an update is delivered, no user comments means the update is accepted/good; a separate human-playtest gate is not required.

## Current state

- **Phase 1 / F Class:** STABLE
- **Phase 2 / E Class:** STABLE
- **Current gameplay:** Phase 3 **v3.1.1 — Command Continuity / Coordinated Withdrawal**
- **Current frontend:** battle-first interface rework, verified
- **Status:** **AUTOMATED VERIFIED CANDIDATE**
- **Exact verified deployed HEAD:** `910ce709bd3c2505005e32e8bbdd8db7fdc34896`
- **Protected Playwright run:** `31365761574` — **22/22 passed**
- **Protected Vercel preview:** `trendy-game-5l9jf5iof-chclpersonal-9731s-projects.vercel.app`
- **Evidence artifact:** `9054170465`
- **Army foundation:** 0 starting musketeers; 150-musketeer hard ceiling per side
- **Adaptive companies:** commanders choose 2–14 soldiers; 11 companies maximum per army
- **Commander Form I / Shii-Cho:** STABLE
- **Form II / Makashi:** next isolated commander-form candidate

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
- Commander guard/combat distractions are suppressed while actively withdrawing.
- E/D troops do not begin a fresh autonomous bayonet charge during RALLY/REGROUP withdrawal.
- Rearward-moving units face their movement direction instead of moonwalking.

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
- only F / E / D are unlocked in Phase 3
- individual soldier tactical-command radius **350**
- tight commander/company proximity metric **180**
- soldier rejoin completion radius **285**
- replacement commanders join physically
- fieldwork controls paid reinforcement and is not a forward spawn
- D Assault Drill remains limited to SIEGE / BREACH / commander CHARGE
- Form I remains **Shii-Cho**
- exact 15-phase class roadmap remains intact

## Latest deployed verification

Exact run `31365761574` tested Vercel preview `trendy-game-5l9jf5iof-chclpersonal-9731s-projects.vercel.app` at exact HEAD `910ce709bd3c2505005e32e8bbdd8db7fdc34896`.

**Result: 22 / 22 Playwright tests passed in about 4.0 minutes.**

The two new frontend regressions verify:

1. primary UI is battle-first; old development chrome and `.card` stacks are absent; Left/Right values use separate columns; advanced telemetry is hidden until **Details** is opened
2. mobile layout places the battlefield above the information panel and has no page-level horizontal overflow

The previous 20 v3.1.1 regressions also remained green, covering command authority, adaptive rebuild thresholds, MUSTER BLOCKED recovery, zero-soldier start, 150 cap, adaptive-company tradeoffs, D progression, F/E economy compatibility, D Assault Drill, autonomous self-play, economy calibration, natural siege, commander return, fieldwork recruitment control, controlled BREACH damage, controls, coordinated withdrawal, visible facing, and physical replacement joining.

### Deterministic behavior preservation

The frontend-only build reproduced the same long-run telemetry as the previous verified v3.1.1 build.

**4 × 600-second economy audit, seeds 32101–32104:**

- all technical invariants valid
- peak living army: **66**
- peak companies: **11**
- maximum sampled D share: about **6.45%**
- highest sampled treasury: about **$2,304.97**, seed 32103
- seed 32103 ended at **0 / 32 living musketeers**, Left E fortress about **6257.57 / 6500**

The high treasury remains a recorded balance/operational observation rather than being hidden.

**9 × 900-second natural-siege audit, seeds 32201–32209:**

- all technical invariants valid
- only seed 32207 produced fortress damage
- Left produced **2 fortress hits**
- minimum Left BREACH distance about **214.155**
- Right E fortress **6500 → about 6486.27 HP**
- the other eight seeds produced zero fortress hits

This exactly preserves the stabilized v3.1.1 siege sample rather than altering it through frontend work.

## Branch policy

- `main` — accepted/stable baseline
- `agent/current` — the only active development branch

Do not create version-specific development branches. Legacy `update/v2.17`, `update/v2.18`, and `update/v2.19` refs are obsolete cleanup refs and do not drive CI.

## Roadmap

1. **F Class — STABLE**
2. **E Class — STABLE**
3. **D Class — NOW: v3.1.1 automated verified candidate**
4. **C Class — NEXT CLASS, locked until the next isolated Phase-3 commander-form slice is verified**
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
- **NEXT:** Form II — **Makashi**, isolated as its own commander-form slice
- continue tracking siege-blocked treasury accumulation without weakening fieldwork logistics
- **LATER:** C Class after the commander-form slice is independently verified

## Verification / acceptance policy

- Failed experiments stay failed in the evidence; acceptance tests are not weakened to make a candidate pass.
- Automated browser evidence proves only the scenarios it actually tests.
- Automated technical failures block advancement.
- After a technically verified update is delivered, **no user comments means accepted/good**.
