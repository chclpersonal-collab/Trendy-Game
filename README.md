# Musketeer Battle Simulator

Autonomous two-army musketeer battle simulation developed on the single rolling branch `agent/current`. Technical completion claims are evidence-gated by the exact deployed Vercel/Playwright build. **Project acceptance convention:** when an update is delivered and the user provides no comments, that update is treated as good/accepted; no separate human-playtest gate is required.

## Current state

- **Phase 1 / F Class:** STABLE
- **Phase 2 / E Class:** STABLE — v2.21 passed 8/8 deployed tests and was accepted with no user comments
- **Current:** Phase 3 **v3.0 — D-Class Foundation / Drilled Fire**
- **Status:** candidate pending the exact deployed automated gate
- **Pricing calibration:** 15/15 complete; Phase-2 baseline retained as the starting economy
- **Commander Form I / Shii-Cho:** STABLE
- **Form II / Makashi:** NEXT FORM, deliberately locked during v3.0 so D musketeers can be isolated first

## v3.0 design

The source roadmap defines D as Phase 3 and preserves the policy that every unlocked rank may be bought or earned, but it does not prescribe D's price or ability. v3.0 therefore uses a conservative first implementation rather than stacking multiple new systems.

### D Class

- Direct price: **$80**
- Earned promotion: **E → D at 10 total XP**
- Direct D starts at **D·0 / 10 XP floor**
- Kill bounty: **$40** under the existing 50%-of-rank-price rule
- Inherits E's existing automatic bayonet charge; no extra bayonet damage is added
- **Drilled fire:** +3.5 percentage points musket aim and a 2-second reload drill bonus
- D reload floor: **25 seconds**; the global musket base remains 30 seconds
- General AI target D share: roughly **2–8%**, stance-dependent
- General AI buys D only as a **surplus top-off** when the army is within two soldiers of its current desired strength, upkeep pressure is low, and at least $120 of extra cash remains beyond the normal reserve plus D's $80 price

D is intended to be a scarce elite line soldier, not an immediate replacement for E. F and E prices and core mechanics remain intact at $10 and $32.

## Phase-2 economy preservation

The first v3.0 candidate incorrectly normalized the old F/E price-quality income term across the new raw F→D price span. That reduced the established value of E-heavy armies and failed the unchanged natural-siege gate. The design was rejected.

The accepted v3.0 candidate preserves the Phase-2 F/E quality formula exactly: F contributes 0 and E contributes 1 to the price-quality average, as before. D contributes a bounded **1.5** rather than its raw $80 price ratio. D's real $80 value still fully affects army-value upkeep. This prevents D from creating a passive-income windfall without silently nerfing E's established economy.

## Preserved Phase-2 systems

v3.0 does not rewrite the proven siege or command layer. It preserves the 110-second committed siege baseline, BREACH pressure, fieldwork recruitment blocking, commander counter-charge, BRACE, physical commander replacement/rejoin, local command radii, company staging, E fortress upgrade, 14-musketeer company cap, 56-musketeer army cap, 30-second global musket base reload, and Form I Shii-Cho.

## Acceptance / verification policy

- Failed experiments stay failed in the evidence; acceptance tests are not weakened to make a build pass.
- Automated browser evidence proves only the scenarios it actually tests.
- User comments are the gameplay-feedback gate. **No comments means accepted/good.**
- If the automated gate fails, the phase does not advance regardless of the comment convention.

## Branch policy

- `main` — accepted/stable baseline
- `agent/current` — the only active development branch

Do not create version-specific development branches. Legacy `update/v2.17`, `update/v2.18`, and `update/v2.19` refs are obsolete cleanup refs and do not drive CI.

## Hard invariants

- 15-phase class roadmap remains intact.
- Maximum 14 musketeers per commander/company.
- Base musket reload remains 30 seconds.
- F permanent melee is not introduced; F only receives temporary low-power melee under commander counter-charge.
- E retains its autonomous bayonet charge; D inherits it rather than replacing it.
- Command remains local and movement/regrouping physical.
- Form I remains Shii-Cho; canonical Form II–VII identities are preserved.
- Fortress HP, treasury, actors and telemetry must remain finite and valid.

## Roadmap

1. **F Class — STABLE**
2. **E Class — STABLE**
3. **D Class — NOW: v3.0 foundation**
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

- **v3.0:** D musketeer foundation, direct/earned progression, drilled fire, surplus-only low-share AI procurement, regression preservation.
- **v3.1 candidate:** evaluate Form II Makashi as a separate commander-form update only after v3.0 is accepted; do not bundle it into D's first balance sample.
- Continue cohesion investigation only with designs that preserve siege continuity; high uncommanded telemetry alone is not sufficient reason to change command behavior.
