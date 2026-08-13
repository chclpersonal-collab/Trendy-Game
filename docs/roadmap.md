# Musketeer Battle Simulator Roadmap

## DONE

- F Class — **STABLE**
- E Class — **STABLE**
- D Class — **STABLE**
- C Class v3.3 / Volley Drill — **STABLE**
- Commander Forms I Shii-Cho and II Makashi — **preserved**
- v3.4 real Offense, Defense, Stamina, Luck and Skill upgrades — **implemented and mechanically proven**
- v3.4 instant full-state JSON export — **implemented and deployed-browser proven**

## REJECTED

### Live-company consolidation

- Existing soldiers were transferred between chronically understrength companies.
- Protected run `31479352271` regressed to 0/3 long-war wins and zero fortress hits across nine natural-siege seeds.
- The experiment remains reverted and must not be reused as accepted precedent.

### v3.4.1 active-BREACH recruit priority

- Gameplay commit `a8b35655c661e4ba9600a7d050585578d37ff6de` routed new fortress-spawned purchases into the active BREACH and topped it toward 12 soldiers.
- Focused mechanics passed, but protected run `31483950617` finished **34/40**.
- Long-war result: **0/3 wins and zero fortress damage**.
- Natural-siege result: **zero fortress hits across all nine 900-second seeds**.
- The previously reproducible seed-32206 conversion fell from 27 hits and a win to zero hits and no winner.
- Artifact `9098617893`, SHA256 `2c3f2217b651e36a0497f58253cf0c3501d1a2f787746a6d11dcedffdeef2285`.
- Exact rejection record: `docs/v3.4.1-breach-reinforcement-rejection.md`.

## NOW — v3.4 stabilization

### v3.4.2 BREACH continuity-hysteresis candidate

- Initial BREACH selection still requires the established six musketeers and active command authority.
- Once selected, the same spearhead may remain assigned down to three living musketeers while it remains within 120 battlefield units of the healthiest forward challenger.
- A healthy six-man company takes over only after clearly overtaking the depleted spearhead, or when the current spearhead falls below three men or loses command authority.
- No existing soldier is transferred.
- Recruitment order and spawn location are unchanged.
- The six-man fieldwork muster-block threshold is unchanged.
- Version/export metadata remains `3.4.0` while this is an unaccepted candidate; candidate identity is exposed separately in siege telemetry.

### Protected acceptance gate

- Focused continuity regression must prove a four-man leading BREACH stays assigned while a nearby healthy company has not clearly overtaken it.
- Focused handoff regression must prove the healthy company takes over after moving more than 120 units ahead.
- Focused logistics regression must prove a retained sub-six spearhead does not enforce the fieldwork recruitment blockade.
- No actor may change company or position merely because spearhead selection is evaluated.
- Full deployed Playwright suite must remain green except for a genuinely unresolved release gate.
- Nine 900-second natural-siege seeds must retain at least one real fortress hit.
- Long-war seeds `32201`, `32206`, `32207` run to 2200 simulated seconds.
- At least 2/3 first wars must resolve, with at least one by 2000 seconds.
- Every seed must produce fortress pressure or a completed win.
- Finite values, treasury, rank validity, fortress bounds, 14/company, 11 companies/army and 150 musketeers/army must remain valid.

## NEXT

- If v3.4.2 passes: accept the continuity rule, record exact evidence and normalize release metadata.
- If it preserves natural siege but still fails 2/3: use the new comparison to isolate final-approach encounter/rear-turn locking without changing recruitment.
- If it regresses natural siege: revert immediately and add diagnostics only before another gameplay rule.

## LATER

1. B Class — blocked until v3.4 stabilization
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

## BLOCKED

- B Class remains blocked until v3.4 passes the strict long-war release gate.
- Human playtesting is not required for this candidate unless explicitly requested; automated deployed-browser evidence remains the current technical gate.
