# Musketeer Battle Simulator Roadmap

## Current — v3.5 Verification Recovery

**Classification:** verification-infrastructure patch and export calibration; no gameplay-balance change.

### Accepted performance fix

The v3.5 target-cache/10 Hz UI hotfix is accepted.

- Original failure export: seed `3101678311`, 153s, severe lag at 95 living actors.
- Automated run `31869048466`: focused probes passed at about 60.86 FPS; the overall job was cancelled by its 15-minute limit during long simulations.
- Acceptance export: seed `1597106260`, 1,725.729s at 4×, peak 317 living actors, 94.18 recent FPS, 1.3/24.7 ms last/max step, 1.8/79.4 ms last/max frame, zero full-pool sorts, about 65.1% cache hits.

Decision: performance blocker resolved for this device and near-cap scenario. Detailed record: `docs/v3.5-performance-hotfix.md`.

### First long export calibration

Seed `1597106260` at 1,725.729s:

- Left: 0 soldiers, 0 commanders, fortress 124.33/6,500 HP.
- Right: 56 soldiers, 11 commanders, fortress untouched, 124 fortress hits.
- First fortress damage around 1,533.1s; Left reached zero soldiers around 1,543.2s.
- Peak armies: 147 and 150 soldiers.
- Purchases: 1,035 / 991; kill income: $10,939 / $11,898; stat spend: $2,990 / $8,820.
- Purchase shares: Left F/E/D/C 63.8/28.2/5.2/2.8%; Right 61.0/30.2/6.4/2.4%.

Decision: no economy retune from one near-win. The losing side's $5.2k treasury accumulated after active BREACH correctly blocked recruitment. Hold current values until the deterministic seed completes and a post-reset export exists. Detailed record: `docs/v3.5-1725s-export-calibration.md`.

### CI repair

- Update stale v3.4 UI assertion to v3.5.
- Use two CI workers and full test-level parallelism.
- Increase workflow limit from 15 to 25 minutes.
- Separate fast regressions from long calibration gates.
- Give long tests evidence-appropriate timeouts.
- Add seed `1597106260` as a deterministic gate: fortress damage by 1,600s and first-war resolution by 1,800s.

## Locked v3.5 Contract

### Economy

- Prices: F $15; E $30; D $45; C $60; B $75; A $90; S $150; SS $300; SSS $450; SSS+ $600; Type I $750; Type II $900; Type III $1,500; Type IV $3,000; **SSS+ Type V $15,000**.
- Soldier maintenance: $0/s.
- Passive income: $10/s; E-fortress bonus: $2/s; bounty: 50%; start: $175.
- Only F/E/D/C are live. B through SSS+ Type V remain roadmap-locked.

### Rank resources

- F/E/D/C HP: 100/115/135/160; Mana: 0/24/36/52; range: 205/220/235/250.
- Future profiles remain authoritative in runtime state and `docs/v3.5-economy-rank-foundation.md`.
- Direct purchases spawn full; promotion preserves damage, applies the existing +20 XP heal, and grants only capacity difference.
- Basic musket 0 Mana; E+ charge 8 Mana; C formal volley 3 Mana.
- Higher ranks have strictly longer hard-limited range; lower ranks form positional forward screens.

## Protected Gates

### Fast gate

Prices/locks, HP/Mana/range, Mana use, UI, shielding, performance cache/frame probes, command/company/fortress/fieldwork/finite invariants.

### Long gate

- 600s F/E/D ecology sample.
- Four 600s zero-maintenance economy seeds.
- Nine 900s natural-siege seeds.
- Seeds `32201`, `32206`, `32207`: at least 2/3 first wars resolve, one by 2,000s.
- Seed `1597106260`: first war resolves by 1,800s.

## Rejected

- v3.4.1 BREACH recruit priority — run `31483950617`, 34/40, 0/3 wins, zero natural fortress hits.
- v3.4.2 continuity hysteresis — run `31673977561`, 39/40, focused behavior passed but 0/3 long-war wins.

Neither rejected layer is active.

## Next

1. Complete the repaired deployed suite.
2. Confirm seed `1597106260` resolves by 1,800s.
3. Collect one post-victory/post-reset export.
4. Change at most one economy family only if sustained non-blockade hoarding is demonstrated.
5. Reassess the 2/3 long-war gate before B Class.

## Later Classes

B → A → S → SS → SSS → SSS+ → Type I → Type II → Type III → Type IV → Type V.

## Blocked

- B Class until the repaired suite completes and long-war evidence is interpreted.
- Economy retuning until a completed-war/post-reset export.
- Future-rank abilities until their individual phases.
