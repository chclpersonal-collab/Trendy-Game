const { test, expect } = require('@playwright/test');

async function openGame(page){
  const response=await page.goto('/',{waitUntil:'domcontentloaded',timeout:30000});
  expect(response).not.toBeNull();expect(response.status()).toBeLessThan(400);
  await page.waitForFunction(()=>Boolean(window.GameTest&&window.__battleSim),null,{timeout:15000});
  const pause=page.locator('#pauseBtn');if((await pause.textContent())?.trim()==='Pause')await pause.click();
}

test('force-factor UI distinguishes authority from local tactical command and preserves both position columns',async({page})=>{
  await openGame(page);const r=await page.evaluate(()=>{GameTest.setSeed(36000);return{state:GameTest.state(),validation:GameTest.validate()}});
  expect(r.validation.ok).toBe(true);expect(r.validation.invalidForceFactors).toBe(false);
  expect(r.state.forceFactors).toHaveLength(2);
  for(const side of r.state.forceFactors){for(const key of['offense','defense','stamina','luck','skill']){expect(Number.isFinite(side[key])).toBe(true);expect(side[key]).toBeGreaterThanOrEqual(0);expect(side[key]).toBeLessThanOrEqual(100)}expect(side.luck).toBe(50)}
  await expect(page.locator('#integrityStat > span').first()).toHaveText('Authority');
  await expect(page.locator('#localCommandStat > span').first()).toHaveText('Local command');
  await expect(page.locator('#uncommandedStat > span').first()).toHaveText('No authority');
  await expect(page.locator('#budgetStat > span').first()).toHaveText('Budget');
  for(const id of['offenseFactorStat','defenseFactorStat','staminaFactorStat','skillFactorStat','luckFactorStat'])await expect(page.locator(`#${id}`)).toBeVisible();
  await expect(page.locator('#positionsStat [data-side="left"]')).toHaveText('0');
  await expect(page.locator('#positionsStat [data-side="right"]')).toHaveText('0');
});

test('reload asymmetry reduces Offense and Stamina without inventing a combat buff',async({page})=>{
  await openGame(page);const r=await page.evaluate(()=>{
    GameTest.setSeed(36001);const api=__battleSim.test;for(const g of api.generals())g.money=1e6;
    for(let i=0;i<12;i++){api.buyMusketeer(0,'F');api.buyMusketeer(1,'F')}
    for(const a of api.actors()){if(!a.alive||a.isCommander)continue;a.hp=100;a.panic=0;a.disarm=0;a.reload=a.team===0?30:0}
    const left=api.forceFactorMetrics(0),right=api.forceFactorMetrics(1),state=GameTest.state(),validation=GameTest.validate();return{left,right,state,validation};
  });
  expect(r.validation.ok).toBe(true);expect(r.state.forceFactorModel.gameplayEffect).toBe(false);
  expect(r.left.readyShare).toBe(0);expect(r.right.readyShare).toBe(1);
  expect(r.left.offense).toBeLessThan(r.right.offense);
  expect(r.left.stamina).toBeLessThan(r.right.stamina);
});

test('Luck tracks actual musket RNG against predicted accuracy with 50 as neutral',async({page})=>{
  await openGame(page);const r=await page.evaluate(()=>{
    GameTest.setSeed(36002);const api=__battleSim.test;for(const g of api.generals())g.money=1000;
    const left=api.buyMusketeer(0,'F'),right=api.buyMusketeer(1,'F');left.x=1400;left.y=300;right.x=1500;right.y=300;left.reload=0;right.reload=0;
    api.fire(left,right,100,false);const state=GameTest.state();
    return{telemetry:state.luckTelemetry[0],factor:state.forceFactors[0].luck,high:api.forceLuckScoreFrom({shots:100,hits:65,expected:50,variance:25}),low:api.forceLuckScoreFrom({shots:100,hits:35,expected:50,variance:25}),validation:GameTest.validate()};
  });
  expect(r.validation.ok).toBe(true);
  expect(r.telemetry.shots).toBe(1);expect(r.telemetry.expected).toBeGreaterThan(0);expect(r.telemetry.expected).toBeLessThan(1);expect(r.telemetry.variance).toBeGreaterThan(0);
  expect(r.factor).toBeGreaterThanOrEqual(0);expect(r.factor).toBeLessThanOrEqual(100);
  expect(r.high).toBeGreaterThan(50);expect(r.low).toBeLessThan(50);
});