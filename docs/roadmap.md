# Roadmap

1. F Class — stable
2. E Class — current stabilization phase
3. D Class — next after Phase 2 is stable
4. C Class
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

## Phase 2 current priorities

- Validate the 30-second musket reload / counter-charge / BRACE battle rhythm.
- Continue reducing pathological long-lived local-command stragglers without making command range meaningless.
- Verify whether v2.19's BREACH reload-pressure fix creates natural siege-to-fortress conversion without making fortresses trivial.
- Use persistent BREACH distance, siege-time, command-integrity and fortress-hit telemetry to distinguish travel stalls from combat stalls.
- Use deployed Playwright/Vercel evidence as the browser regression gate before calling a candidate verified.
- Keep the GitHub/Vercel/Playwright loop efficient: narrow source reads, one batched functional push per candidate, maximum 60-second deployment polling, cancel superseded CI, and do not run browser CI for documentation-only changes.
- Continue experimental pricing calibration through patches 14–15.
- Keep only Commander Form I — Shii-Cho active until the current combat layer is stable.

## Next planned update

Phase 2 v2.20 / Experimental Pricing Patch 14/15: use the v2.19 natural-siege sample and human Vercel playtest to decide whether the 92-unit BREACH pressure line should be held, tuned, or reverted. Continue command/cohesion stabilization. Do not advance to D Class until Phase 2 is judged stable.
