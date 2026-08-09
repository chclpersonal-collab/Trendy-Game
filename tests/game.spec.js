const { test, expect } = require('@playwright/test');

const CANONICAL_FORMS = [
  'I Shii-Cho',
  'II Makashi',
  'III Soresu',
  'IV Ataru',
  'V Shien/Djem So',
  'VI Niman',
  'VII Juyo/Vaapad'
];

async function openGame(page) {
  const pageErrors = [];
  const consoleErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error' && !message.text().toLowerCase().includes('favicon')) {
      consoleErrors.push(message.text());
    }
  });

  const response = await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  expect(response).not.toBeNull();
  expect(response.status()).toBeLessThan(400);
  await page.waitForFunction(() => Boolean(window.GameTest && window.__battleSim), null, { timeout: 15000 });

  const pauseButton = page.locator('#pauseBtn');
  if ((await pauseButton.textContent())?.trim() === 'Pause') await pauseButton.click();
  return { pageErrors, consoleErrors };
}

test('deployed preview boots and preserves core invariants', async ({ page }, testInfo) => {
  const diagnostics = await openGame(page);
  const result = await page.evaluate(() => ({ state: window.GameTest.state(), validation: window.GameTest.validate() }));
  expect(result.validation.ok).toBe(true);
  expect(result.validation.companyMax).toBeLessThanOrEqual(14);
  expect(result.validation.maxPerCommander).toBe(14);
  expect(result.validation.roadmapCount).toBe(15);
  expect(result.state.phase).toBe(2);
  expect(result.state.command.maxMusketeers).toBe(14);
  expect(result.state.command.musket.baseReload).toBe(30);
  expect(result.state.command.lightsaberForm.forms).toEqual(CANONICAL_FORMS);
  expect(await page.title()).toContain(result.state.version);
  expect(diagnostics.pageErrors).toEqual([]);
  await testInfo.attach('console-errors.json', { body: Buffer.from(JSON.stringify(diagnostics.consoleErrors, null, 2)), contentType: 'application/json' });
});

test('300-second deterministic browser self-play remains valid', async ({ page }, testInfo) => {
  await openGame(page);
  const result = await page.evaluate(() => {
    window.GameTest.setSeed(21818);
    const state = window.GameTest.advance(300);
    return { state, validation: window.GameTest.validate() };
  });
  expect(result.validation.ok).toBe(true);
  expect(result.validation.companyMax).toBeLessThanOrEqual(14);
  expect(result.state.time).toBeGreaterThanOrEqual(299.9);
  expect(result.state.time).toBeLessThanOrEqual(300.1);
  expect(result.state.money.every(Number.isFinite)).toBe(true);
  expect(result.state.fortresses.every(f => Number.isFinite(f.hp) && f.hp >= 0 && f.hp <= f.maxHp)).toBe(true);
  await page.waitForTimeout(100);
  const screenshotPath = testInfo.outputPath('battle-300s.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  await testInfo.attach('battle-300s.png', { path: screenshotPath, contentType: 'image/png' });
  await testInfo.attach('state-300s.json', { body: Buffer.from(JSON.stringify(result, null, 2)), contentType: 'application/json' });
});

test('controlled BREACH converts into real fortress damage', async ({ page }, testInfo) => {
  await openGame(page);
  const result = await page.evaluate(() => {
    window.GameTest.setSeed(21819);
    window.GameTest.forceBreach(0, 0, true);
    const before = window.GameTest.snapshot();
    const after = window.GameTest.advance(1);
    return { before, after, validation: window.GameTest.validate() };
  });
  await testInfo.attach('controlled-breach.json', { body: Buffer.from(JSON.stringify(result, null, 2)), contentType: 'application/json' });
  expect(result.validation.ok).toBe(true);
  expect(result.after.fortressHits[0]).toBeGreaterThan(result.before.fortressHits[0]);
  expect(result.after.fortresses[1].hp).toBeLessThan(result.before.fortresses[1].hp);
});

test('player-facing controls work on the deployed build', async ({ page }) => {
  await openGame(page);
  const pauseButton = page.locator('#pauseBtn');
  const speedButton = page.locator('#speedBtn');
  const frontButton = page.locator('#frontBtn');
  await expect(pauseButton).toHaveText('Resume');
  await pauseButton.click();
  await expect(pauseButton).toHaveText('Pause');
  await pauseButton.click();
  await expect(pauseButton).toHaveText('Resume');
  await speedButton.click();
  await expect(speedButton).toHaveText('Speed 2×');
  await speedButton.click();
  await expect(speedButton).toHaveText('Speed 4×');
  await speedButton.click();
  await expect(speedButton).toHaveText('Speed 1×');
  await page.evaluate(() => {
    window.GameTest.setSeed(21820);
    window.GameTest.advance(20);
    document.getElementById('fieldWrap').scrollLeft = 0;
  });
  await frontButton.click();
  await page.waitForTimeout(500);
  expect(await page.locator('#fieldWrap').evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
});
