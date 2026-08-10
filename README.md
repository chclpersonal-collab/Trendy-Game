# Musketeer Battle Simulator

Autonomous two-army musketeer battle simulation developed on the single rolling branch `agent/current`. Technical completion claims are evidence-gated by the exact deployed Vercel/Playwright build. **Project acceptance convention:** after an update is delivered, no user comments means the update is accepted/good; a separate human-playtest gate is not required.

## Current state

- **Phase 1 / F Class:** STABLE
- **Phase 2 / E Class:** STABLE
- **Current:** Phase 3 **v3.1.1 — Command Continuity / Coordinated Withdrawal**
- **Status:** **AUTOMATED VERIFIED CANDIDATE**
- **Exact verified deployed HEAD:** `d79cbcf36fadd375125b8c5b0ad30f3117fe3dc6`
- **Protected Playwright run:** `31358519582` — **20/20 passed**
- **Protected Vercel preview:** `trendy-game-k8cush2ly-chclpersonal-9731s-projects.vercel.app`
- **Evidence artifact:** `9051555549`
- **Army foundation:** 0 starting musketeers; 150-musketeer hard ceiling per side
- **Adaptive companies:** commanders choose 2–14 soldiers; 11 companies maximum per army
- **Commander Form I / Shii-Cho:** STABLE
- **Form II / Makashi:** next commander-form candidate, still locked during this stabilization patch

## v3.1.1 — Command Continuity / Coordinated Withdrawal

### Bug Fix — commander retreat is not commander death

The old command model used the tight **180-unit commander/company proximity radius** as if losing that spacing meant losing command. This could make soldiers appear uncommanded or panicked simply because their living commander had moved away during regrouping or withdrawal.

v3.1.1 separates two concepts:

- **Morale / command authority:** an original living commander remains the company's authority while alive, even if temporarily outside the 180-unit tight-cohesion radius.
- **Local tactical control:** detailed soldier orders still require the established **350-unit local soldier-command radius**.

So a living commander moving away does **not** make the company mentally collapse, but this is also **not global radio command**. Soldiers outside local tactical range hold/regroup coherently while the commander closes the distance.

### Commander death still causes real disruption

Commander death remains the actual command-loss event.

- soldiers can become genuinely uncommanded/panicked after the commander dies
- command integrity falls when the company has no active command source
- an unjoined replacement commander does not immediately restore authority
- the replacement must physically reach the company before `joinedCommand` becomes true
- BREACH viability also remains unavailable until that physical replacement joins

This preserves the physical replacement invariant while removing false command collapse from ordinary commander movement.

### Bug Fix — commander no longer retreats alone

`RALLY` and rearward `DEFEND` are now coordinated company withdrawals.

During an active withdrawal:

- the commander uses the company center as the withdrawal reference instead of abandoning the formation
- commander guard/combat distractions are suppressed while the withdrawal movement is active
- soldiers and commander move rearward together
- a living commander continues to provide morale authority during the movement
- E/D soldiers do not launch a fresh autonomous bayonet charge while under RALLY/REGROUP withdrawal behavior

### Visual / Movement Bug Fix — no retreat moonwalking

Backward-moving soldiers and commanders now turn to face the direction they are actually moving.

This applies to:

- RALLY withdrawal
- rearward DEFEND movement
- panic retreat
- disarm retreat
- close-range fallback movement
- commander rearward movement

The renderer draws the musket, bayonet, saber, and attack effects from the actor's `facing` value, so this is a visible sprite-direction fix rather than telemetry-only state.

### Bug Fix — adaptive-company rebuilding now respects chosen size

v3.1 introduced commander-selected 2–14 soldier companies, but the old rebuild thresholds were still fixed at 4 soldiers to enter rebuild and 8 to recover. A fully staffed 2–4 man command could therefore be treated as permanently depleted and remain in RALLY.

v3.1.1 scales rebuild thresholds relative to the commander's chosen target size.

Examples verified by regression:

- target **2** → rebuild at **1**, ready again at **2**
- target **14** → rebuild at **4**, ready again at **8**, preserving the previous large-company behavior

### Audit / UI — siege-blocked emergency recovery

A long-run economy sample produced a wiped Left army with about **$2,304.97** still in treasury. The economy remained finite and below the existing $3,000 automated ceiling, but a rich 0-soldier army looked suspicious.

The recovery code was audited and the player-facing budget state is now explicit:

- if an army has fewer than 7 soldiers and recruitment is possible → **RECOVER F**
- if a viable enemy BREACH is blocking the fieldwork → **MUSTER BLOCKED**
- once that BREACH is relieved → emergency F recruitment resumes immediately

A targeted deployed regression reproduces a **0-soldier / $2,305** defender under a viable six-man enemy BREACH, proves recruitment is blocked and labeled `MUSTER BLOCKED`, then relieves the siege and proves the General immediately buys 3 F musketeers under `RECOVER F`.

This does **not** weaken the existing fieldwork logistics rule. An overrun fieldwork still blocks paid reinforcement.

## v3.1 — Adaptive Company Cohesion foundation

Commanders choose a target load from **2–14 musketeers** rather than defaulting to 14.

Mission preference bands remain:

- **BUILD:** 2–6
- **DEFEND:** 4–8
- **CONTEST:** 5–10
- **ATTACK:** 8–12
- **SIEGE:** 10–14

High upkeep can push new commands smaller. If all 11 company slots exist and more soldiers are needed, existing targets may expand toward 14.

### Cohesion tradeoff

Cohesion scales with living company load from about **1.22 at 2 soldiers** to **0.84 at 14 soldiers**.

Smaller commands gain:

- tighter spacing
- faster formation recovery
- faster commander decisions
- faster formal-volley synchronization

Larger commands gain:

- more simultaneous musket mass
- greater attrition depth
- easier threshold access: formal volley at 4 ready musketeers, counter-charge evaluation at 5, BREACH viability at 6

Small companies receive no free raw damage, generic aim bonus, or global reload bonus.

## Army / rank foundations preserved

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
- F→E at **4 XP**
- E→D at **10 XP**
- every earned XP restores **20 HP**, capped at full health
- D Assault Drill remains limited to SIEGE / BREACH / commander CHARGE
- only F / E / D are unlocked in Phase 3

## Final deployed verification — v3.1.1

Exact run `31358519582` tested Vercel preview `trendy-game-k8cush2ly-chclpersonal-9731s-projects.vercel.app` at exact HEAD `d79cbcf36fadd375125b8c5b0ad30f3117fe3dc6`.

**Result: 20 / 20 Playwright tests passed in about 4.2 minutes.**

The gate includes:

1. v3.1.1 metadata / command-authority model
2. adaptive 2–14 rebuild thresholds
3. MUSTER BLOCKED → RECOVER F after siege relief
4. zero-soldier start / 150 cap
5. small-vs-large cohesion tradeoff
6. 151st-purchase rejection
7. direct and earned D progression
8. Phase-2 F/E economy compatibility
9. D Assault Drill activation
10. funded SIEGE D procurement
11. 300-second autonomous self-play
12. 4 × 600-second economy calibration
13. 9 × 900-second natural-siege acceptance
14. physical commander return
15. fieldwork recruitment block/reopen
16. controlled BREACH fortress damage
17. Pause / Speed / Front controls
18. living-commander separation vs commander-death command loss
19. coordinated RALLY retreat + visible facing direction
20. physical replacement joining before command/BREACH restoration

### Economy audit — 4 × 600 seconds

Seeds 32101–32104 all preserved technical invariants.

- peak living army: **66**
- peak companies: **11**
- maximum sampled D share: about **6.45%**
- highest sampled treasury: about **$2,304.97**, seed 32103
- seed 32103 ended at **0 / 32 living musketeers** with the Left E fortress damaged to about **6257.57 / 6500**

The high treasury remains a recorded balance/operational observation rather than being hidden. The dedicated muster-block regression proves that siege logistics can legitimately create a rich-but-unable-to-recruit state and that recruitment resumes after relief.

### Natural siege audit — same 9 × 900-second seeds

The same seeds 32201–32209 used for v3.1 were replayed after the command-continuity/rebuild fixes.

Only **seed 32207** produced fortress damage:

- Left fortress hits: **2**
- minimum Left BREACH distance: about **214.155**
- Right E fortress: **6500 → about 6486.27 HP**
- peak armies: **59 / 63**
- peak company counts: **11 / 10**

The other eight seeds produced zero fortress hits.

This is a meaningful stabilization result: v3.1 produced **123 combined fortress hits** in the same nine-seed audit, including a 117-hit seed. v3.1.1 produced **2 total hits**. The 117-hit sustained-BREACH warning therefore **did not reproduce**, while natural fortress conversion remains possible.

## Failed / corrected evidence retained

- v3.1.1 run `31358114685`: **19/20 passed**. The sole failure was a new MUSTER BLOCKED test that forgot to set the attacker company's target to the intended six-man BREACH configuration. The already-existing fieldwork blockade regression passed in that same run. The test setup was corrected; no gameplay workaround was added.
- earlier universal-passive-D candidates remain rejected because they suppressed natural siege and/or altered the established E economy.
- the old separated-commander soldier fallback remains rejected because it created rejoin churn and erased natural siege conversion.

## Hard command / movement invariants

- living original commander retreat/spacing does **not** by itself cause morale collapse
- detailed tactical orders remain local; individual soldier tactical radius stays **350**
- tight commander/company proximity remains **180** as a proximity/cohesion measurement
- commander death causes command disruption
- replacement commanders must physically join before restoring authority
- RALLY/rearward DEFEND move commander and soldiers together
- units moving backward face their movement direction
- fieldwork paid-recruitment blockade remains intact
- BREACH still requires at least 6 company musketeers plus an active command source
- committed siege baseline and fortress mechanics remain intact
- Form I remains Shii-Cho; Form II Makashi remains locked in this patch

## Branch policy

- `main` — accepted/stable baseline
- `agent/current` — the only active development branch

Do not create version-specific development branches. Legacy `update/v2.17`, `update/v2.18`, and `update/v2.19` refs are obsolete cleanup refs and do not drive CI.

## Roadmap

1. **F Class — STABLE**
2. **E Class — STABLE**
3. **D Class — NOW: v3.1.1 automated verified candidate**
4. **C Class — NEXT CLASS, still locked during Phase-3 commander-form stabilization**
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

- **v3.1.1:** Command Continuity / Coordinated Withdrawal — automated gate passed 20/20
- **next candidate:** Form II — **Makashi**, now that the 117-hit v3.1 siege outlier no longer reproduces in the same nine-seed audit
- continue tracking siege-blocked treasury accumulation as an operational/economy observation rather than weakening fieldwork logistics
- **C Class:** remains locked until the next Phase-3 commander-form slice is isolated and verified
- maintain healthy future rank ecology inside the 150-soldier army space rather than making every higher class exponentially invisible

## Verification / acceptance policy

- Failed experiments stay failed in the evidence; acceptance tests are not weakened to make a candidate pass.
- Automated browser evidence proves only the scenarios it actually tests.
- Automated technical failures block advancement.
- After a technically verified update is delivered, **no user comments means accepted/good**.
