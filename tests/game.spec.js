const { test, expect } = require('@playwright/test');

const CANONICAL_FORMS = [
  'I Shii-Cho','II Makashi','III Soresu','IV Ataru','V Shien/Djem So','VI Niman','VII Juyo/Vaapad'
];

async function openGame(page) {
  const pageErrors = [];
  const consoleErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error' && !message.text().toLowerCase().includes('favicon')) consoleErrors.push(message.text());
  });
  const response = await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  expect(response).not.toBeNull();
  expect(response.status()).toBeLessThan(400);
  await page.waitForFunction(() => Boolean(window.GameTest && window.__battleSim), null, { timeout: 15000 });
  const pauseButton = page.locator('#pauseBtn');
  if ((await pauseButton.textContent())?.trim() === 'Pause') await pauseButton.click();
  return { pageErrors, consoleErrors };
}

test('deployed preview boots with v2.21 Patch 15 invariants', async ({ page }, testInfo) => {
  const diagnostics = await openGame(page);
  const result = await page.evaluate(() => ({ state: window.GameTest.state(), validation: window.GameTest.validate() }));
  expect(result.validation.ok).toBe(true);
  expect(result.validation.companyMax).toBeLessThanOrEqual(14);
  expect(result.validation.maxPerCommander).toBe(14);
  expect(result.validation.roadmapCount).toBe(15);
  expect(result.state.version).toBe('2.21');
  expect(result.state.phase).toBe(2);
  expect(result.state.economy.patch).toBe(15);
  expect(result.state.economy.patchTarget).toBe(15);
  expect(result.state.economy.pricingStatus).toBe('patch-15-final-calibration');
  expect(result.state.economy.rankPrices).toEqual({ F: 10, E: 32 });
  expect(result.state.economy.passiveIncome).toBe(10);
  expect(result.state.economy.upkeepRate).toBeCloseTo(0.016, 8);
  expect(result.state.command.maxMusketeers).toBe(14);
  expect(result.state.command.musket.baseReload).toBe(30);
  expect(result.state.command.recovery.rawCommanderRegroupTarget).toBe(true);
  expect(result.state.command.recovery.tacticalOrdersRequireCompanyIntegrity).toBe(true);
  expect(result.state.command.recovery.commandRadius).toBe(180);
  expect(result.state.command.recovery.soldierCommandRadius).toBe(350);
  expect(result.state.command.siegeEscalation.fieldworkMusterBlockRange).toBe(205);
  expect(result.state.command.lightsaberForm.forms).toEqual(CANONICAL_FORMS);
  expect(await page.title()).toContain('v2.21');
  expect(diagnostics.pageErrors).toEqual([]);
  await testInfo.attach('console-errors.json', { body: Buffer.from(JSON.stringify(diagnostics.consoleErrors, null, 2)), contentType: 'application/json' });
});

test('300-second deterministic self-play remains finite and bounded', async ({ page }, testInfo) => {
  await openGame(page);
  const result = await page.evaluate(() => {
    window.GameTest.setSeed(22118);
    const state = window.GameTest.advance(300);
    return { state, validation: window.GameTest.validate() };
  });
  expect(result.validation.ok).toBe(true);
  expect(result.validation.companyMax).toBeLessThanOrEqual(14);
  expect(result.state.time).toBeGreaterThanOrEqual(299.9);
  expect(result.state.time).toBeLessThanOrEqual(300.1);
  expect(result.state.money.every(v => Number.isFinite(v) && v >= -0.001)).toBe(true);
  expect(result.state.fortresses.every(f => Number.isFinite(f.hp) && f.hp >= 0 && f.hp <= f.maxHp)).toBe(true);
  const screenshotPath = testInfo.outputPath('battle-300s.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  await testInfo.attach('battle-300s.png', { path: screenshotPath, contentType: 'image/png' });
  await testInfo.attach('state-300s.json', { body: Buffer.from(JSON.stringify(result, null, 2)), contentType: 'application/json' });
});

test('Patch 15 economy calibration stays below the pre-upkeep runaway baseline', async ({ page }, testInfo) => {
  test.setTimeout(120000);
  await openGame(page);
  const result = await page.evaluate(() => {
    const out=[];
    for(const seed of [22101,22102,22103,22104]){
      window.GameTest.setSeed(seed);
      const maxTreasury=[0,0];
      for(let sample=0;sample<20;sample++){
        window.GameTest.advance(30);
        const s=window.GameTest.state();
        for(let t=0;t<2;t++) maxTreasury[t]=Math.max(maxTreasury[t],s.money[t]);
      }
      const state=window.GameTest.snapshot();
      out.push({seed,validation:window.GameTest.validate(),maxTreasury,money:state.money,army:state.musketeers,eclass:state.eclass,purchases:state.purchases,rankPurchases:state.rankPurchases,promotions:state.promotions,incomeRates:state.economy.incomeRates,upkeepRates:state.economy.upkeepRates,netIncomeRates:state.economy.netIncomeRates,fortresses:state.fortresses,warsWon:state.warsWon});
    }
    return out;
  });
  console.log(`ECONOMY_CALIBRATION ${JSON.stringify(result)}`);
  await testInfo.attach('economy-calibration.json',{body:Buffer.from(JSON.stringify(result,null,2)),contentType:'application/json'});
  expect(result.every(x=>x.validation.ok)).toBe(true);
  const maxTreasury=Math.max(...result.flatMap(x=>x.maxTreasury));
  const totalEPurchases=result.reduce((sum,x)=>sum+x.rankPurchases[0].E+x.rankPurchases[1].E,0);
  const totalPromotions=result.reduce((sum,x)=>sum+x.promotions[0]+x.promotions[1],0);
  expect(maxTreasury).toBeLessThan(3000);
  expect(totalEPurchases).toBeGreaterThan(0);
  expect(totalPromotions).toBeGreaterThan(0);
});

test('three-seed 600-second natural siege preserves pressure and records cohesion recovery', async ({ page }, testInfo) => {
  test.setTimeout(90000);
  await openGame(page);
  const result = await page.evaluate(() => {
    const out=[];
    for(const seed of [21901,21902,21903]){
      window.GameTest.setSeed(seed);
      const minDistance=[Infinity,Infinity],peakUncommanded=[0,0],peakRejoining=[0,0];
      for(let i=0;i<120;i++){
        window.GameTest.advance(5);
        const state=window.GameTest.state();
        for(let t=0;t<2;t++){
          if(state.breachFortDistance[t]!==null) minDistance[t]=Math.min(minDistance[t],state.breachFortDistance[t]);
          peakUncommanded[t]=Math.max(peakUncommanded[t],state.uncommanded[t]);
          peakRejoining[t]=Math.max(peakRejoining[t],state.rejoining[t]);
        }
      }
      const state=window.GameTest.snapshot();
      out.push({seed,validation:window.GameTest.validate(),fortressHits:state.fortressHits,siegePushes:state.siegePushes,siegeSeconds:state.siegeSeconds,minBreachFortDistance:minDistance.map(v=>Number.isFinite(v)?v:null),peakUncommanded,peakRejoining,commandIntegrity:state.commandIntegrity,uncommanded:state.uncommanded,rejoining:state.rejoining,soldierRejoins:state.soldierRejoins,fortresses:state.fortresses});
    }
    return out;
  });
  console.log(`NATURAL_SIEGE ${JSON.stringify(result)}`);
  await testInfo.attach('natural-siege-sample.json', { body: Buffer.from(JSON.stringify(result, null, 2)), contentType: 'application/json' });
  expect(result.every(x => x.validation.ok)).toBe(true);
  const totalHits=result.reduce((sum,x)=>sum+x.fortressHits[0]+x.fortressHits[1],0);
  expect(totalHits).toBeGreaterThan(0);
});

test('separated living commander remains a physical regroup target without restoring tactical command', async ({ page }, testInfo) => {
  await openGame(page);
  const result=await page.evaluate(()=>{
    window.GameTest.setSeed(22121);
    const api=window.__battleSim.test,c=api.companies()[0][0],actors=api.actors();
    const commander=actors.find(a=>a.alive&&a.team===0&&a.isCommander&&a.company===c.id);
    const soldier=actors.find(a=>a.alive&&a.team===0&&!a.isCommander&&a.company===c.id);
    commander.x=700;
    soldier.x=1200;
    soldier.y=commander.y;
    const commanderSeparated=api.commanderInCommand(c)===null;
    const beforeDistance=Math.hypot(commander.x-soldier.x,commander.y-soldier.y);
    api.updateMusketeer(soldier,1);
    const afterDistance=Math.hypot(commander.x-soldier.x,commander.y-soldier.y);
    return{commanderSeparated,beforeDistance,afterDistance,rejoining:!!soldier.rejoining,companyStillSeparated:api.commanderInCommand(c)===null,validation:window.GameTest.validate()};
  });
  await testInfo.attach('separated-commander-recovery.json',{body:Buffer.from(JSON.stringify(result,null,2)),contentType:'application/json'});
  expect(result.validation.ok).toBe(true);
  expect(result.commanderSeparated).toBe(true);
  expect(result.rejoining).toBe(true);
  expect(result.afterDistance).toBeLessThan(result.beforeDistance);
  expect(result.beforeDistance-result.afterDistance).toBeCloseTo(26,5);
  expect(result.companyStillSeparated).toBe(true);
});

test('fieldwork siege control blocks and reopens paid recruitment without moving the spawn', async ({ page }, testInfo) => {
  await openGame(page);
  const result=await page.evaluate(()=>{
    window.GameTest.setSeed(22122);
    window.GameTest.forceBreach(0,0,true);
    const api=window.__battleSim.test,g=api.generals()[1];
    const before={money:g.money,purchases:g.purchases,musketeers:window.GameTest.state().musketeers[1]};
    const blockedBefore=api.fieldworkMusterBlocked(1);
    const blockedBuy=api.buyMusketeer(1,'F');
    const afterBlocked={money:g.money,purchases:g.purchases,musketeers:window.GameTest.state().musketeers[1]};
    window.GameTest.forceStance(0,'CONTEST');
    const blockedAfterRelief=api.fieldworkMusterBlocked(1);
    const reopenedBuy=api.buyMusketeer(1,'F');
    const afterRelief={money:g.money,purchases:g.purchases,musketeers:window.GameTest.state().musketeers[1],x:reopenedBuy?.x??null};
    return{blockedBefore,blockedBuy:blockedBuy===null,before,afterBlocked,blockedAfterRelief,reopenedBuy:Boolean(reopenedBuy),afterRelief,validation:window.GameTest.validate()};
  });
  await testInfo.attach('fieldwork-control.json',{body:Buffer.from(JSON.stringify(result,null,2)),contentType:'application/json'});
  expect(result.validation.ok).toBe(true);
  expect(result.blockedBefore).toBe(true);
  expect(result.blockedBuy).toBe(true);
  expect(result.afterBlocked).toEqual(result.before);
  expect(result.blockedAfterRelief).toBe(false);
  expect(result.reopenedBuy).toBe(true);
  expect(result.afterRelief.purchases).toBe(result.before.purchases+1);
  expect(result.afterRelief.musketeers).toBe(result.before.musketeers+1);
  expect(result.afterRelief.money).toBeCloseTo(result.before.money-10,6);
  expect(result.afterRelief.x).toBe(2670);
});

test('controlled BREACH still converts into fortress damage', async ({ page }, testInfo) => {
  await openGame(page);
  const result=await page.evaluate(()=>{
    window.GameTest.setSeed(22119);
    window.GameTest.forceBreach(0,0,true);
    const before=window.GameTest.snapshot();
    const after=window.GameTest.advance(1);
    return{before,after,validation:window.GameTest.validate()};
  });
  await testInfo.attach('controlled-breach.json',{body:Buffer.from(JSON.stringify(result,null,2)),contentType:'application/json'});
  expect(result.validation.ok).toBe(true);
  expect(result.after.fortressHits[0]).toBeGreaterThan(result.before.fortressHits[0]);
  expect(result.after.fortresses[1].hp).toBeLessThan(result.before.fortresses[1].hp);
});

test('player-facing Pause, Speed, and Front controls work', async ({ page }) => {
  await openGame(page);
  const pause=page.locator('#pauseBtn'),speed=page.locator('#speedBtn'),front=page.locator('#frontBtn');
  await expect(pause).toHaveText('Resume');
  await pause.click(); await expect(pause).toHaveText('Pause');
  await pause.click(); await expect(pause).toHaveText('Resume');
  await speed.click(); await expect(speed).toHaveText('Speed 2×');
  await speed.click(); await expect(speed).toHaveText('Speed 4×');
  await speed.click(); await expect(speed).toHaveText('Speed 1×');
  await page.evaluate(()=>{window.GameTest.setSeed(22120);window.GameTest.advance(20);document.getElementById('fieldWrap').scrollLeft=0});
  await front.click(); await page.waitForTimeout(500);
  expect(await page.locator('#fieldWrap').evaluate(el=>el.scrollLeft)).toBeGreaterThan(0);
});
