const { test, expect } = require('@playwright/test');
const fs=require('fs');

async function openGame(page){
  const response=await page.goto('/',{waitUntil:'domcontentloaded',timeout:30000});expect(response).not.toBeNull();expect(response.status()).toBeLessThan(400);
  await page.waitForFunction(()=>Boolean(window.GameTest&&window.__battleSim),null,{timeout:15000});const pause=page.locator('#pauseBtn');if((await pause.textContent())?.trim()==='Pause')await pause.click();
}

test('army stats are paid upgrades and each stat changes its intended gameplay mechanic',async({page})=>{
  await openGame(page);
  const r=await page.evaluate(()=>{
    GameTest.setSeed(36001);const api=__battleSim.test,g0=api.generals()[0],g1=api.generals()[1];g0.money=10000;g1.money=10000;
    const a=api.buyMusketeer(0,'F'),b=api.buyMusketeer(1,'F');a.x=1400;a.y=300;b.x=1500;b.y=300;
    const cost=api.statUpgradeCost(0),moneyBefore=g0.money,baseDamage=api.scaleCombatDamage(a,b,100,1),reloadBefore=api.musketReloadTime(a),aimBefore=api.shotAccuracy(a,b,100),luckBefore=api.luckCritChance(0);
    const paid=api.buyStatUpgrade(0,'Offense');const moneyAfter=g0.money,offenseDamage=api.scaleCombatDamage(a,b,100,1);
    api.buyStatUpgrade(1,'Defense',true);const defendedDamage=api.scaleCombatDamage(a,b,100,1);
    api.buyStatUpgrade(0,'Stamina',true);const reloadAfter=api.musketReloadTime(a);
    api.buyStatUpgrade(0,'Skill',true);const aimAfter=api.shotAccuracy(a,b,100);
    api.buyStatUpgrade(0,'Luck',true);const luckAfter=api.luckCritChance(0),forcedLucky=api.luckyDamageMultiplier(0,0),forcedNotLucky=api.luckyDamageMultiplier(0,1);
    return{paid,cost,moneyBefore,moneyAfter,baseDamage,offenseDamage,defendedDamage,reloadBefore,reloadAfter,aimBefore,aimAfter,luckBefore,luckAfter,forcedLucky,forcedNotLucky,state:GameTest.state(),validation:GameTest.validate()};
  });
  expect(r.validation.ok).toBe(true);expect(r.validation.invalidStats).toBe(false);expect(r.paid).toBe(true);expect(r.moneyBefore-r.moneyAfter).toBe(r.cost);
  expect(r.state.armyStats[0].Offense).toBe(2);expect(r.state.armyStats[1].Defense).toBe(2);expect(r.offenseDamage).toBeGreaterThan(r.baseDamage);expect(r.defendedDamage).toBeLessThan(r.offenseDamage);
  expect(r.reloadAfter).toBeLessThan(r.reloadBefore);expect(r.aimAfter).toBeGreaterThan(r.aimBefore);expect(r.luckBefore).toBe(0);expect(r.luckAfter).toBeGreaterThan(0);expect(r.forcedLucky).toBe(1.5);expect(r.forcedNotLucky).toBe(1);
});

test('wealthy stable General AI invests surplus in a real training upgrade',async({page})=>{
  await openGame(page);
  const r=await page.evaluate(()=>{GameTest.setSeed(36002);const api=__battleSim.test,g=api.generals()[0];g.money=10000;g.stance='ATTACK';g.reserveTarget=80;for(let i=0;i<18;i++)api.buyMusketeer(0,'F');g.money=10000;g.nextStatUpgradeAt=0;const before={...g.stats},chosen=api.tryArmyTraining(0),after={...g.stats};return{chosen,before,after,plan:g.budgetPlan,money:g.money,upgrades:g.statUpgrades,spend:g.statSpend,validation:GameTest.validate()}});
  expect(r.validation.ok).toBe(true);expect(typeof r.chosen).toBe('string');expect(['Offense','Defense','Stamina','Luck','Skill']).toContain(r.chosen);expect(r.after[r.chosen]).toBe(r.before[r.chosen]+1);expect(r.plan).toBe(`TRAIN ${r.chosen.toUpperCase()}`);expect(r.upgrades).toBe(1);expect(r.spend).toBeGreaterThan(0);
});

test('Export State downloads a complete current-state JSON immediately without advancing the battle',async({page},testInfo)=>{
  await openGame(page);await page.evaluate(()=>GameTest.setSeed(36003));
  const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#exportStateBtn').click()]);const path=await download.path();expect(path).toBeTruthy();const payload=JSON.parse(fs.readFileSync(path,'utf8'));
  expect(download.suggestedFilename()).toMatch(/^musketeer-state-v3\.4\.0-seed-36003-war-1-t-0s\.json$/);expect(payload.game).toBe('Musketeer Battle Simulator');expect(payload.version).toBe('3.4.0');expect(payload.runtime.seed).toBe(36003);expect(payload.runtime.simTime).toBe(0);expect(Number.isInteger(payload.runtime.rngState)).toBe(true);
  expect(payload.state.patchVersion).toBe('3.4.0');expect(payload.state.armyStats[0].Offense).toBe(1);expect(Array.isArray(payload.actors)).toBe(true);expect(payload.actors.length).toBeGreaterThan(0);expect(Array.isArray(payload.generals)).toBe(true);expect(Array.isArray(payload.positions)).toBe(true);expect(Array.isArray(payload.flightRecorder)).toBe(true);expect(payload.anomalies.longWarNoWinner).toBe(false);
  await testInfo.attach('instant-export-example.json',{body:Buffer.from(JSON.stringify(payload,null,2)),contentType:'application/json'});
});