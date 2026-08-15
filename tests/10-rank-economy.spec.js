const { test, expect } = require('@playwright/test');

async function openGame(page){
  const response=await page.goto('/',{waitUntil:'domcontentloaded',timeout:30000});expect(response).not.toBeNull();expect(response.status()).toBeLessThan(400);
  await page.waitForFunction(()=>Boolean(window.GameTest&&window.__battleSim),null,{timeout:15000});const pause=page.locator('#pauseBtn');if((await pause.textContent())?.trim()==='Pause')await pause.click();
}

const EXPECTED_PRICES={F:15,E:30,D:45,C:60,B:75,A:90,S:150,SS:300,SSS:450,'SSS+':600,'SSS+ Type I':750,'SSS+ Type II':900,'SSS+ Type III':1500,'SSS+ Type IV':3000,'SSS+ Type V':15000};

test('rank economy defines all fifteen corrected purchase prices and removes soldier maintenance',async({page})=>{
  await openGame(page);
  const r=await page.evaluate(()=>{GameTest.setSeed(37000);const s=GameTest.state(),api=__battleSim.test;return{prices:s.economy.rankPrices,purchasable:s.economy.purchasableRanks,locked:s.classProgression.locked,profiles:s.classProgression.rankProfiles,corrected:s.classProgression.correctedFinalRank,upkeep:s.economy.upkeepRates,upkeepRate:s.economy.upkeepRate,noMaintenance:s.economy.noSoldierMaintenance,revision:s.economy.revision,order:api.rankOrder(),validation:GameTest.validate()}});
  expect(r.validation.ok).toBe(true);expect(r.validation.invalidEconomy).toBe(false);expect(r.prices).toEqual(EXPECTED_PRICES);expect(r.order).toEqual(Object.keys(EXPECTED_PRICES));expect(r.purchasable).toEqual(['F','E','D','C']);expect(r.locked).toEqual(['B','A','S','SS','SSS','SSS+','SSS+ Type I','SSS+ Type II','SSS+ Type III','SSS+ Type IV','SSS+ Type V']);expect(r.corrected).toBe('SSS+ Type V');expect(r.upkeep).toEqual([0,0]);expect(r.upkeepRate).toBe(0);expect(r.noMaintenance).toBe(true);expect(r.revision).toBe('rank-resources-zero-maintenance-v1');
  const ranges=r.order.map(x=>r.profiles[x].range),hp=r.order.map(x=>r.profiles[x].hp),mana=r.order.map(x=>r.profiles[x].mana);for(const values of[ranges,hp,mana])for(let i=1;i<values.length;i++)expect(values[i]).toBeGreaterThan(values[i-1]);
});

test('unlocked ranks receive real HP, mana and increasing range while extended fire consumes and regenerates mana',async({page})=>{
  await openGame(page);
  const r=await page.evaluate(()=>{
    GameTest.setSeed(37001);const api=__battleSim.test,g0=api.generals()[0],g1=api.generals()[1];g0.money=1000;g1.money=1000;
    const f=api.buyMusketeer(0,'F'),e=api.buyMusketeer(0,'E'),d=api.buyMusketeer(0,'D'),c=api.buyMusketeer(0,'C'),target=api.buyMusketeer(1,'F');
    e.x=1000;e.y=300;target.x=1220;target.y=300;e.reload=0;const manaBefore=e.mana,cost=api.rangedManaCost(e,220),fired=api.fire(e,target,220),manaAfter=e.mana;e.mana=0;api.updateActors(10);const regenerated=e.mana;
    return{units:[f,e,d,c].map(a=>({rank:a.rank,hp:a.hp,maxHp:a.maxHp,mana:a.mana,maxMana:a.maxMana,range:api.rankAttackRange(a)})),prices:GameTest.state().economy.rankPrices,manaBefore,cost,fired,manaAfter,regenerated,totals:api.teamResourceTotals(0),validation:GameTest.validate()}
  });
  expect(r.validation.ok).toBe(true);expect(r.validation.invalidRankResources).toBe(false);expect(r.units.map(x=>x.maxHp)).toEqual([100,115,130,145]);expect(r.units.map(x=>x.maxMana)).toEqual([20,30,42,55]);expect(r.units.map(x=>x.range)).toEqual([215,230,245,260]);expect(r.units.map(x=>x.hp)).toEqual(r.units.map(x=>x.maxHp));expect(r.prices.F).toBe(15);expect(r.prices.E).toBe(30);expect(r.prices.D).toBe(45);expect(r.prices.C).toBe(60);expect(r.fired).toBe(true);expect(r.cost).toBeGreaterThan(0);expect(r.manaAfter).toBeCloseTo(r.manaBefore-r.cost,6);expect(r.regenerated).toBeGreaterThan(0);expect(r.totals.maxHp).toBe(490);expect(r.totals.maxMana).toBe(147);
});

test('a lower-rank line soldier intercepts musket fire aimed at a higher-rank ally',async({page})=>{
  await openGame(page);
  const r=await page.evaluate(()=>{
    GameTest.setSeed(37002);const api=__battleSim.test,g0=api.generals()[0],g1=api.generals()[1];g0.money=1000;g1.money=1000;
    const attacker=api.buyMusketeer(0,'F'),shield=api.buyMusketeer(1,'F'),protectedUnit=api.buyMusketeer(1,'C');attacker.x=1000;attacker.y=300;shield.x=1100;shield.y=335;protectedUnit.x=1200;protectedUnit.y=300;attacker.reload=0;
    const resolved=api.findShieldingTarget(attacker,protectedUnit),before=api.shieldingInterceptions()[1],fired=api.fire(attacker,protectedUnit,200),after=api.shieldingInterceptions()[1],state=GameTest.state();
    return{shieldId:shield.id,protectedId:protectedUnit.id,resolvedId:resolved.id,fired,before,after,doctrine:state.rankResources.shieldDoctrine,validation:GameTest.validate()}
  });
  expect(r.validation.ok).toBe(true);expect(r.resolvedId).toBe(r.shieldId);expect(r.resolvedId).not.toBe(r.protectedId);expect(r.fired).toBe(true);expect(r.after).toBe(r.before+1);expect(r.doctrine).toContain('lower-rank');
});