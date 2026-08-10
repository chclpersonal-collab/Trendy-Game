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
  expect(result.state.version).toBe('2.20');
  expect(result.state.phase).toBe(2);
  expect(result.state.economy.patch).toBe(14);
  expect(result.state.economy.pricingHold).toBe(true);
  expect(result.state.economy.emergencyFPrice).toBe(15);
  expect(result.state.economy.emergencyFortressMaxBuy).toBe(1);
  expect(result.state.economy.recoveryThreshold).toBe(7);
  expect(result.state.economy.paidMusterX).toEqual([770, 2230]);
  expect(result.state.economy.fortressReserveX).toEqual([330, 2670]);
  expect(result.state.command.maxMusketeers).toBe(14);
  expect(result.state.command.musket.baseReload).toBe(30);
  expect(result.state.command.siegeEscalation.breachPressRange).toBe(92);
  expect(result.state.command.siegeEscalation.breachReloadPressRange).toBe(58);
  expect(result.state.command.siegeEscalation.breachFortDangerRange).toBe(70);
  expect(result.state.command.siegeEscalation.breachProgressStep).toBe(12);
  expect(result.state.command.siegeEscalation.breachProgressGrace).toBe(60);
  expect(result.state.command.siegeEscalation.fieldworkMusterBlockRange).toBe(205);
  expect(result.state.command.lightsaberForm.forms).toEqual(CANONICAL_FORMS);
  expect(await page.title()).toContain(result.state.version);
  expect(diagnostics.pageErrors).toEqual([]);
  await testInfo.attach('console-errors.json', { body: Buffer.from(JSON.stringify(diagnostics.consoleErrors, null, 2)), contentType: 'application/json' });
});

test('300-second deterministic browser self-play remains valid', async ({ page }, testInfo) => {
  await openGame(page);
  const result = await page.evaluate(() => {
    window.GameTest.setSeed(22018);
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

test('natural siege sample still produces fortress pressure', async ({ page }, testInfo) => {
  test.setTimeout(90000);
  await openGame(page);
  const result = await page.evaluate(() => {
    const seeds = [21901, 21902, 21903];
    const output = [];
    for (const seed of seeds) {
      window.GameTest.setSeed(seed);
      const minDistance = [Infinity, Infinity];
      const activeSamples = [0, 0];
      const lossReasons = [
        { underStrength: 0, commanderDead: 0, commanderSeparated: 0, generalAbortOrReassignment: 0 },
        { underStrength: 0, commanderDead: 0, commanderSeparated: 0, generalAbortOrReassignment: 0 }
      ];
      const assignmentsSeen = [new Set(), new Set()];
      let previousIds = [-1, -1];

      for (let sample = 0; sample < 120; sample++) {
        window.GameTest.advance(5);
        const state = window.GameTest.state();
        const generals = window.__battleSim.test.generals();
        const actors = window.__battleSim.test.actors();
        const companySets = window.__battleSim.test.companies();

        for (let team = 0; team < 2; team++) {
          const id = state.breachCompanyIds[team];
          const distance = state.breachFortDistance[team];
          if (distance !== null) {
            minDistance[team] = Math.min(minDistance[team], distance);
            activeSamples[team]++;
          }
          if (id >= 0) assignmentsSeen[team].add(id);

          const oldId = previousIds[team];
          if (oldId >= 0 && id !== oldId) {
            const oldCompany = companySets[team].find(c => c.id === oldId);
            const men = actors.filter(a => a.alive && a.team === team && !a.isCommander && a.company === oldId).length;
            const commander = actors.find(a => a.alive && a.team === team && a.isCommander && a.company === oldId) || null;
            if (men < 6) lossReasons[team].underStrength++;
            else if (!commander) lossReasons[team].commanderDead++;
            else if (oldCompany && !window.__battleSim.test.commanderInCommand(oldCompany)) lossReasons[team].commanderSeparated++;
            else if (generals[team].stance !== 'SIEGE' || id !== oldId) lossReasons[team].generalAbortOrReassignment++;
          }
          previousIds[team] = id;
        }
      }

      const state = window.GameTest.snapshot();
      output.push({
        seed,
        validation: window.GameTest.validate(),
        fortressHits: state.fortressHits,
        siegePushes: state.siegePushes,
        siegeSeconds: state.siegeSeconds,
        finalBreachFortDistance: state.breachFortDistance,
        minBreachFortDistance: minDistance.map(v => Number.isFinite(v) ? v : null),
        breachActiveSeconds: activeSamples.map(n => n * 5),
        assignmentsSeen: assignmentsSeen.map(s => [...s]),
        lossReasons,
        commandIntegrity: state.commandIntegrity,
        uncommanded: state.uncommanded,
        emergencyPurchases: state.emergencyPurchases,
        fortresses: state.fortresses
      });
    }
    return output;
  });
  console.log(`NATURAL_SIEGE ${JSON.stringify(result)}`);
  await testInfo.attach('natural-siege-sample.json', { body: Buffer.from(JSON.stringify(result, null, 2)), contentType: 'application/json' });
  expect(result.every(x => x.validation.ok)).toBe(true);
  const totalHits = result.reduce((sum, x) => sum + x.fortressHits[0] + x.fortressHits[1], 0);
  expect(totalHits).toBeGreaterThan(0);
});

test('fieldwork muster is physical and fortress reserve prevents a siege hard lock', async ({ page }, testInfo) => {
  await openGame(page);
  const result = await page.evaluate(() => {
    window.GameTest.setSeed(22021);
    window.GameTest.forceBreach(0, 0, true);
    const api = window.__battleSim.test;
    const g = api.generals()[1];
    const defenders = api.actors().filter(a => a.alive && a.team === 1 && !a.isCommander);
    for (const defender of defenders.slice(0, 8)) api.killActor(defender, null, 'test');

    const blockedBefore = api.fieldworkMusterBlocked(1);
    const before = { money: g.money, purchases: g.purchases, emergencyPurchases: g.emergencyPurchases, musketeers: window.GameTest.state().musketeers[1] };
    const blockedBuy = api.buyMusketeer(1, 'F');
    const afterBlocked = { money: g.money, purchases: g.purchases, emergencyPurchases: g.emergencyPurchases, musketeers: window.GameTest.state().musketeers[1] };
    const emergencyBuy = api.buyMusketeer(1, 'F', false, true);
    const afterEmergency = { money: g.money, purchases: g.purchases, emergencyPurchases: g.emergencyPurchases, musketeers: window.GameTest.state().musketeers[1], x: emergencyBuy?.x ?? null };
    const secondEmergency = api.buyMusketeer(1, 'F', false, true);

    window.GameTest.forceStance(0, 'CONTEST');
    const blockedAfterRelief = api.fieldworkMusterBlocked(1);
    const reopenedBuy = api.buyMusketeer(1, 'F');
    const afterRelief = { money: g.money, purchases: g.purchases, emergencyPurchases: g.emergencyPurchases, musketeers: window.GameTest.state().musketeers[1], x: reopenedBuy?.x ?? null };
    return { blockedBefore, blockedBuy: blockedBuy === null, before, afterBlocked, emergencyBuy: Boolean(emergencyBuy), afterEmergency, secondEmergency: secondEmergency === null, blockedAfterRelief, reopenedBuy: Boolean(reopenedBuy), afterRelief, validation: window.GameTest.validate() };
  });
  await testInfo.attach('fieldwork-muster.json', { body: Buffer.from(JSON.stringify(result, null, 2)), contentType: 'application/json' });
  expect(result.validation.ok).toBe(true);
  expect(result.blockedBefore).toBe(true);
  expect(result.blockedBuy).toBe(true);
  expect(result.afterBlocked).toEqual(result.before);
  expect(result.emergencyBuy).toBe(true);
  expect(result.afterEmergency.purchases).toBe(result.before.purchases + 1);
  expect(result.afterEmergency.emergencyPurchases).toBe(result.before.emergencyPurchases + 1);
  expect(result.afterEmergency.musketeers).toBe(result.before.musketeers + 1);
  expect(result.afterEmergency.money).toBeCloseTo(result.before.money - 15, 6);
  expect(result.afterEmergency.x).toBe(2670);
  expect(result.secondEmergency).toBe(true);
  expect(result.blockedAfterRelief).toBe(false);
  expect(result.reopenedBuy).toBe(true);
  expect(result.afterRelief.purchases).toBe(result.before.purchases + 2);
  expect(result.afterRelief.emergencyPurchases).toBe(result.before.emergencyPurchases + 1);
  expect(result.afterRelief.musketeers).toBe(result.before.musketeers + 2);
  expect(result.afterRelief.money).toBeCloseTo(result.before.money - 25, 6);
  expect(result.afterRelief.x).toBe(2230);
});

test('controlled BREACH converts into real fortress damage', async ({ page }, testInfo) => {
  await openGame(page);
  const result = await page.evaluate(() => {
    window.GameTest.setSeed(22019);
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
    window.GameTest.setSeed(22020);
    window.GameTest.advance(20);
    document.getElementById('fieldWrap').scrollLeft = 0;
  });
  await frontButton.click();
  await page.waitForTimeout(500);
  expect(await page.locator('#fieldWrap').evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
});
