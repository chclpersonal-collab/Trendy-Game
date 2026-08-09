CI evidence should be recorded in GitHub Actions artifacts and PR comments, not committed after each run. This prevents evidence writes from recursively triggering Vercel and Playwright.
