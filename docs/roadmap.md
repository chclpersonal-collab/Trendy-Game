# Musketeer Battle Simulator Roadmap

## DONE

- F Class — **STABLE**
- E Class — **STABLE**
- D Class — **STABLE**
- C Class v3.3 / Volley Drill — **STABLE**
- Commander Forms I Shii-Cho and II Makashi — **preserved**
- v3.4 real Offense, Defense, Stamina, Luck and Skill upgrades — **implemented and mechanically proven**
- v3.4 instant full-state JSON export — **implemented and deployed-browser proven**

## REJECTED SIEGE EXPERIMENTS

### Live-company consolidation

- Existing soldiers were transferred between chronically understrength companies.
- Protected run `31479352271` regressed to 0/3 long-war wins and zero fortress hits across nine natural-siege seeds.
- The experiment remains reverted.

### v3.4.1 active-BREACH recruit priority

- Commit `a8b35655c661e4ba9600a7d050585578d37ff6de` routed fortress-spawned purchases into the active BREACH.
- Run `31483950617` finished 34/40 with 0/3 long-war wins and zero fortress hits across all nine natural-siege seeds.
- Artifact `9098617893`, SHA256 `2c3f2217b651e36a0497f58253cf0c3501d1a2f787746a6d11dcedffdeef2285`.
- Exact record: `docs/v3.4.1-breach-reinforcement-rejection.md`.

### v3.4.2 BREACH continuity hysteresis

- Commit `77338be283db34efe0970d276a6f841076617f6c` retained a depleted leading spearhead until a healthy company clearly overtook it.
- Run `31673977561` finished 39/40. Focused tests passed and seed `32208` retained two natural fortress hits, but all three 2200-second release seeds remained unresolved with zero fortress damage.
- Result: 0/3 long-war wins; candidate rejected.
- Artifact `9170990259`, SHA256 `9b3670cfc4983e6cb1a0c08133eccc91a07b4cb597e3ddd65f5fe6988d6dadd3`.
- Exact record: `docs/v3.4.2-breach-continuity-rejection.md`.

## NOW — v3.4.3 RANK ECONOMY / RESOURCE FOUNDATION

### Economy rework

- Remove all soldier maintenance: **$0/s upkeep**.
- Preserve $10/s passive income, the E-fortress income bonus and the 50% defeated-rank kill bounty for the first comparable export sample.
- Remove rank-composition income bonuses.
- Treat later price changes as export-led calibration rather than guessing before evidence exists.

### Corrected 15-rank price ladder

| Rank | Cost |
|---|---:|
| F | $15 |
| E | $30 |
| D | $45 |
| C | $60 |
| B | $75 |
| A | $90 |
| S | $150 |
| SS | $300 |
| SSS | $450 |
| SSS+ | $600 |
| SSS+ Type I | $750 |
| SSS+ Type II | $900 |
| SSS+ Type III | $1,500 |
| SSS+ Type IV | $3,000 |
| SSS+ Type V | $15,000 |

Correction: the final rank is **SSS+ Type V**, not “SSS Type V.”

### HP, Mana and range foundation

- Give every one of the 15 ranks an explicit max HP, max Mana, Mana-regeneration rate, musket range and battlefield role.
- Every higher rank must have strictly more HP, Mana and range than the rank below it.
- Keep only F/E/D/C unlocked in the current Phase 4 build; B through SSS+ Type V remain defined but locked.
- Ordinary fire within the established 205-unit range remains Mana-free.
- Extended-range fire consumes Mana and cannot exceed the shooter’s rank range.
- Extended fortress fire requires SIEGE or BREACH.
- Lower ranks physically positioned in front of higher ranks intercept musket shots, establishing a real shield/screen doctrine.
- Detailed profile table and rules: `docs/rank-economy-v1.md`.

### Export-state calibration checklist

Track in every useful playtest export:

- treasury growth and unspent cash
- purchases and living composition by rank
- time-to-first E/D/C and later ranks after unlock
- total HP and Mana pools
- Mana use, depletion and regeneration
- extended-range firing behavior
- lower-rank shielding interceptions
- fortress hits and first-war duration
- army/company caps and fieldwork recruitment blocks
- stat-training spend versus troop procurement

## PROTECTED ACCEPTANCE GATE

- Exact prices must match the 15-rank table.
- F/E/D/C direct purchase costs must be $15/$30/$45/$60.
- Soldier upkeep, upkeep pressure and maintenance paid must remain zero.
- All rank profiles must be finite and strictly increasing in HP, Mana and range.
- Direct purchases must spawn at full rank HP and Mana.
- Promotion must preserve the existing +20 HP XP-heal rule without a second full heal.
- Long shots must consume Mana, respect rank range and regenerate Mana over time.
- A lower-rank screen must intercept a musket shot aimed at a higher-rank ally when physically between shooter and target.
- Future ranks must remain locked.
- Existing finite-value, fortress, company, army and rank-validity checks must remain green.
- The new economy is intentionally measured before final treasury/rank-share balance thresholds are locked.

## NEXT

- Collect a new exported state from a meaningful autonomous playtest under the zero-maintenance economy.
- Tune passive income, bounty, rank procurement, HP, Mana or range only where the export shows a concrete imbalance.
- Reassess the long-war resolution problem after the economy/resource baseline is measured; do not mix another BREACH-specific experiment into this first economy sample.

## LATER — CLASS PHASES

1. B Class
2. A Class
3. S Class
4. SS Class
5. SSS Class
6. SSS+ Class
7. SSS+ Class Type I
8. SSS+ Class Type II
9. SSS+ Class Type III
10. SSS+ Class Type IV
11. SSS+ Class Type V — final

Each later class phase activates its already-defined price/resource profile and adds its distinct ability without unlocking later ranks early.

## BLOCKED

- B Class activation remains blocked until the v3.4 economy/resource foundation is technically verified and reviewed through export-state evidence.
- Human playtesting is performed only when explicitly requested; automated deployed-browser checks remain the technical gate for this candidate.