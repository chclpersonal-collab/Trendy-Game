# Musketeer Battle Simulator Roadmap

## DONE

- F Class — **STABLE**
- E Class — **STABLE**
- D Class — **STABLE**
- C Class v3.3 / Volley Drill — **STABLE**
- Commander Forms I Shii-Cho and II Makashi — **preserved**
- v3.4 real Offense, Defense, Stamina, Luck and Skill upgrades — **implemented and mechanically proven**
- v3.4 instant full-state JSON export — **implemented and deployed-browser proven**
- Rejected live-company consolidation experiment — **reverted**; existing soldiers are not to be reassigned between active companies as a siege fix

## NOW — v3.4 stabilization

### v3.4.1 BREACH reinforcement-priority candidate

Code commit: `a8b35655c661e4ba9600a7d050585578d37ff6de`

- Route new paid recruits to the currently viable BREACH company before depleted rear companies.
- Permit a bounded active-spearhead top-off to 12 soldiers, within the existing 10–14 SIEGE company band and 14-soldier hard cap.
- Use an independent F-Class top-off only when ordinary procurement would otherwise buy nothing.
- Defer army-stat training while a viable active BREACH remains below the bounded top-off.
- Preserve the six-soldier BREACH viability minimum, fortress spawning, fieldwork muster block, upkeep checks, army/company caps and rank ecology.
- Never transfer an existing live soldier between companies.

Status: **CANDIDATE CHECKPOINT / NOT YET A RELEASE**. Vercel deployment is READY. GitHub Actions run `31483950617` remained in progress after the five-minute reporting limit, inside the deployed Playwright suite.

### Protected acceptance gate

- Focused regression: a new recruit enters the active BREACH before an understrength rear company.
- Focused regression: no pre-existing soldier changes company or position during recruitment.
- Focused regression: non-SIEGE recruitment keeps the established first-understrength-company behavior.
- Full deployed Playwright suite must remain green.
- Long-war seeds `32201`, `32206`, `32207` run to 2200 simulated seconds.
- At least 2/3 first wars must resolve, with at least one by 2000 seconds.
- Every seed must produce fortress pressure or a completed win.
- Finite values, treasury, rank validity, fortress bounds, 14/company, 11 companies/army and 150 musketeers/army must remain valid.

## NEXT

- If the protected gate passes: accept v3.4.1, update release evidence, then begin B Class planning.
- If the protected gate fails: revert the candidate and audit BREACH final-approach movement/encounter locking. Do not return to global company consolidation or live-soldier reassignment.

## LATER

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

## BLOCKED

- B Class is blocked until v3.4 passes the strict long-war release gate.
- Human playtesting is not required for this candidate unless explicitly requested; automated deployed-browser evidence is the current technical gate.
