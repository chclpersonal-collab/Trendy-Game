const { test, expect } = require('@playwright/test');

async function openGame(page){
  const response=await page.goto('/',{waitUntil:'domcontentloaded',timeout:30000});expect(response).not.toBeNull();expect(response.status()).toBeLessThan(400);
  await page.waitForFunction(()=>Boolean(window.GameTest&&window.__battleSim),null,{timeout:15000});const pause=page.locator('#pauseBtn');if((await pause.textContent())?.trim()==='Pause')await pause.click();
}

const COSTS={F:15,E:30,D:45,C:60,B:75,A:90,S:150,SS:300,SSS:450,'SSS+':600,'SSS+ Type I':750,'SSS+ Type II':900,'SSS+ Type III':1500,'SSS+ Type IV':3000,'SSS+ Type V':15000};

test('v3.5 installs the complete corrected rank economy with zero soldier maintenance',async({page})=>{
  await openGame(page);
  const r=await page.evaluate(()=>{GameTest.setSeed(35001);const api=__battleSim.test,s=GameTest.state();return{state:s,upkeep:[api.upkeepRate(0),api.upkeepRate(1)],validation:GameTest.validate()}});
  expect(r.validation.ok).toBe(true);expect(r.validation.invalidRankVitals).toBe(false);
  expect(r.state.version).toBe('3.5');expect(r.state.patchVersion).toBe('3.5.0');expect(r.state.rework).toBe('ranked-economy-hp-mana-range-screening');
  expect(r.state.economy.rankPrices).toEqual(COSTS);expect(r.state.economy.purchasableRanks).toEqual(['F','E','D','C']);expect(r.state.economy.maintenanceRemoved).toBe(true);expect(r.state.economy.rankQualityIncomeRemoved).toBe(true);expect(r.upkeep).toEqual([0,0]);expect(r.state.economy.upkeepRates).toEqual([0,0]);
  expect(r.state.rankSystem.correctedFinalRank).toBe('SSS+ Type V');expect(r.state.rankSystem.futureRanksLocked).toBe(true);expect(r.state.rankSystem.order).toHaveLength(15);
  const profiles=r.state.rankSystem.order.map(rank=>r.state.rankSystem.profiles[rank]);for(let i=1;i<profiles.length;i++)expect(profiles[i].range).toBeGreaterThan(profiles[i-1].range);
});

test('unlocked ranks charge exact prices and spawn with authoritative HP, mana, and range',async({page})=>{
  await openGame(page);
  const r=await page.evaluate(()=>{
    GameTest.setSeed(35002);const api=__battleSim.test,g=api.generals()[0];g.money=10000;const out=[];
    for(const rank of['F','E','D','C']){const before=g.money,a=api.buyMusketeer(0,rank),p=api.rankProfileOf(a);out.push({rank,cost:before-g.money,hp:a.hp,maxHp:a.maxHp,mana:a.mana,maxMana:a.maxMana,range:api.rankRangeOf(a),profile:p})}
    return{out,state:GameTest.state(),validation:GameTest.validate()}
  });
  expect(r.validation.ok).toBe(true);
  for(const x of r.out){expect(x.cost).toBe(COSTS[x.rank]);expect(x.hp).toBe(x.profile.hp);expect(x.maxHp).toBe(x.profile.hp);expect(x.mana).toBe(x.profile.mana);expect(x.maxMana).toBe(x.profile.mana);expect(x.range).toBe(x.profile.range)}
  expect(r.out[0].mana).toBe(0);expect(r.out[1].hp).toBeGreaterThan(r.out[0].hp);expect(r.out[3].range).toBeGreaterThan(r.out[2].range);
});

test('mana is real: bayonet charges and formal C volleys consume it while basic musket fire does not',async({page})=>{
  await openGame(page);
  const r=await page.evaluate(()=>{
    GameTest.setSeed(35003);const api=__battleSim.test,g0=api.generals()[0],g1=api.generals()[1];g0.money=g1.money=10000;
    const e=api.buyMusketeer(0,'E'),c=api.buyMusketeer(0,'C'),f=api.buyMusketeer(0,'F'),enemy=api.buyMusketeer(1,'F');
    e.x=1400;e.y=260;enemy.x=1510;enemy.y=260;e.chargeCooldown=0;e.reload=10;const eBefore=e.mana,charged=api.beginCharge(e,enemy),eAfter=e.mana;
    c.x=1400;c.y=320;enemy.x=1520;enemy.y=320;c.reload=0;enemy.hp=10000;const cBefore=c.mana;api.fire(c,enemy,120,true);const cAfter=c.mana;
    f.x=1400;f.y=380;enemy.x=1520;enemy.y=380;f.reload=0;const fBefore=f.mana;api.fire(f,enemy,120,false);const fAfter=f.mana;
    return{charged,eBefore,eAfter,cBefore,cAfter,fBefore,fAfter,costs:GameTest.state().rankSystem.manaUses,validation:GameTest.validate()}
  });
  expect(r.validation.ok).toBe(true);expect(r.charged).toBe(true);expect(r.eBefore-r.eAfter).toBe(r.costs.bayonetCharge);expect(r.cBefore-r.cAfter).toBe(r.costs.formalVolleyShot);expect(r.fBefore).toBe(0);expect(r.fAfter).toBe(0);
});

test('lower ranks screen higher ranks in targeting and occupy the forward formation layer',async({page})=>{
  await openGame(page);
  const r=await page.evaluate(()=>{
    GameTest.setSeed(35004);const api=__battleSim.test,g0=api.generals()[0],g1=api.generals()[1];g0.money=g1.money=10000;
    const attacker=api.buyMusketeer(0,'C'),shield=api.buyMusketeer(1,'F'),high=api.buyMusketeer(1,'C');attacker.x=1000;attacker.y=300;shield.x=1200;shield.y=300;high.x=1280;high.y=300;
    const screened=api.combatEnemy(attacker)?.id;shield.y=520;const exposed=api.combatEnemy(attacker)?.id;
    const company=api.companies()[0][attacker.company],front=api.buyMusketeer(0,'F'),cmd=api.actors().find(a=>a.alive&&a.team===0&&a.isCommander&&a.company===company.id);attacker.x=front.x=1400;attacker.y=320;front.y=300;cmd.x=1375;cmd.y=310;company.command='ADVANCE';shield.x=high.x=2700;api.applyRankScreenFormation(attacker,1);api.applyRankScreenFormation(front,1);
    return{screened,exposed,shieldId:shield.id,highId:high.id,frontX:front.x,highX:attacker.x,policy:GameTest.state().rankSystem.shielding,validation:GameTest.validate()}
  });
  expect(r.validation.ok).toBe(true);expect(r.screened).toBe(r.shieldId);expect(r.exposed).toBe(r.highId);expect(r.frontX).toBeGreaterThan(r.highX);expect(r.policy.lowerRanksForward).toBe(true);
});
