const { test, expect } = require('@playwright/test');

async function openGame(page){
  const response=await page.goto('/',{waitUntil:'domcontentloaded',timeout:30000});expect(response).not.toBeNull();expect(response.status()).toBeLessThan(400);
  await page.waitForFunction(()=>Boolean(window.GameTest&&window.__battleSim),null,{timeout:15000});const pause=page.locator('#pauseBtn');if((await pause.textContent())?.trim()==='Pause')await pause.click();
}

test('rank range is a hard firing limit for soldiers and organized fortress fire',async({page})=>{
  await openGame(page);
  const r=await page.evaluate(()=>{
    GameTest.setSeed(35101);const api=__battleSim.test,g0=api.generals()[0],g1=api.generals()[1];g0.money=g1.money=10000;
    const f=api.buyMusketeer(0,'F'),e=api.buyMusketeer(0,'E'),target=api.buyMusketeer(1,'F'),fort=api.fortresses()[1];
    f.x=1000;f.y=300;e.x=1000;e.y=360;target.x=1210;target.y=300;f.reload=e.reload=0;
    const fShot=api.fire(f,target,210),fReload=f.reload;e.y=300;target.hp=target.maxHp;const eShot=api.fire(e,target,210),eReload=e.reload;
    f.x=fort.x-210;f.reload=0;const fortBefore=fort.hp,fortShot=api.fireFortress(f,fort,210),fortAfter=fort.hp,state=GameTest.state();
    return{fRange:api.rankRangeOf(f),eRange:api.rankRangeOf(e),fShot,fReload,eShot,eReload,fortShot,fortBefore,fortAfter,label:api.rankLabelXP(999),policy:state.rankSystem,validation:GameTest.validate()}
  });
  expect(r.validation.ok).toBe(true);expect(r.fRange).toBe(205);expect(r.eRange).toBe(220);expect(r.fShot).toBe(false);expect(r.fReload).toBe(0);expect(r.eShot).toBe(true);expect(r.eReload).toBeGreaterThan(0);expect(r.fortShot).toBe(false);expect(r.fortAfter).toBe(r.fortBefore);expect(r.label).toBe('C·981');expect(r.policy.rangeHardLimitEnforced).toBe(true);expect(r.policy.veteranLabelsUseUnlockedRanksOnly).toBe(true);
});

test('promotion capacity does not inflate XP-healing telemetry',async({page})=>{
  await openGame(page);
  const r=await page.evaluate(()=>{
    GameTest.setSeed(35102);const api=__battleSim.test,g=api.generals()[0];g.money=1000;const d=api.buyMusketeer(0,'D');d.xp=17;d.hp=120;const before=GameTest.state().healing[0];api.awardKill(d,{isCommander:false,rank:'F'},'test');const state=GameTest.state();return{rank:d.rank,hp:d.hp,maxHp:d.maxHp,healingDelta:state.healing[0]-before,policy:state.rankSystem,validation:GameTest.validate()}
  });
  expect(r.validation.ok).toBe(true);expect(r.rank).toBe('C');expect(r.hp).toBe(160);expect(r.maxHp).toBe(160);expect(r.healingDelta).toBe(15);expect(r.policy.healingTelemetryExcludesPromotionCapacity).toBe(true);
});