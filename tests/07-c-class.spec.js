const { test, expect } = require('@playwright/test');

async function openGame(page){
  const response=await page.goto('/',{waitUntil:'domcontentloaded',timeout:30000});
  expect(response).not.toBeNull();expect(response.status()).toBeLessThan(400);
  await page.waitForFunction(()=>Boolean(window.GameTest&&window.__battleSim),null,{timeout:15000});
  const pause=page.locator('#pauseBtn');if((await pause.textContent())?.trim()==='Pause')await pause.click();
}

test('C Class is directly buyable for $60 and D promotes to C at 18 total XP with the C HP profile',async({page})=>{
  await openGame(page);
  const r=await page.evaluate(()=>{
    GameTest.setSeed(35301);const api=__battleSim.test,g=api.generals()[0];g.money=10000;
    const before=g.money,c=api.buyMusketeer(0,'C'),afterDirect=g.money,d=api.buyMusketeer(0,'D');
    d.xp=17;d.hp=50;api.awardKill(d,{isCommander:false,rank:'F'},'test');
    const s=GameTest.state();
    return{before,afterDirect,direct:{rank:c.rank,xp:c.xp,hp:c.hp,maxHp:c.maxHp,mana:c.mana},earned:{rank:d.rank,xp:d.xp,hp:d.hp,maxHp:d.maxHp,mana:d.mana},cPromotions:s.cPromotions,cclass:s.cclass,prices:s.economy.rankPrices,purchasable:s.economy.purchasableRanks,validation:GameTest.validate()};
  });
  expect(r.validation.ok).toBe(true);
  expect(r.before-r.afterDirect).toBe(60);
  expect(r.direct).toEqual({rank:'C',xp:18,hp:160,maxHp:160,mana:52});
  expect(r.earned.rank).toBe('C');expect(r.earned.xp).toBe(18);expect(r.earned.hp).toBe(95);expect(r.earned.maxHp).toBe(160);expect(r.earned.mana).toBe(52);
  expect(r.cPromotions[0]).toBe(1);expect(r.cclass[0]).toBe(2);expect(r.prices.C).toBe(60);expect(r.purchasable).toContain('C');
});

test('C Volley Drill is formal-volley-only and does not become a passive universal stat bonus',async({page})=>{
  await openGame(page);
  const r=await page.evaluate(()=>{
    GameTest.setSeed(35302);const api=__battleSim.test,g=api.generals()[0],eg=api.generals()[1];g.money=1000;eg.money=1000;
    const c=api.buyMusketeer(0,'C'),enemy=api.buyMusketeer(1,'F');c.x=1400;c.y=300;enemy.x=1520;enemy.y=300;
    const ordinaryReload=api.musketReloadTime(c),ordinaryAim=api.shotAccuracy(c,enemy,120),ordinaryActive=api.cVolleyDrillActive(c);
    c.cVolleyDrill=true;const volleyReload=api.musketReloadTime(c),volleyAim=api.shotAccuracy(c,enemy,120),volleyActive=api.cVolleyDrillActive(c);c.cVolleyDrill=false;
    c.reload=0;enemy.hp=enemy.maxHp;const manaBefore=c.mana;api.fire(c,enemy,120,true);const firedVolleyReload=c.reload,manaAfter=c.mana;
    return{ordinaryReload,ordinaryAim,ordinaryActive,volleyReload,volleyAim,volleyActive,firedVolleyReload,manaBefore,manaAfter,rankAtLeastD:api.rankAtLeast(c,'D'),state:GameTest.state(),validation:GameTest.validate()};
  });
  expect(r.validation.ok).toBe(true);expect(r.ordinaryActive).toBe(false);expect(r.volleyActive).toBe(true);expect(r.volleyAim-r.ordinaryAim).toBeCloseTo(.045,8);expect(r.ordinaryReload-r.volleyReload).toBeCloseTo(2.5,8);expect(r.firedVolleyReload).toBeCloseTo(r.volleyReload,8);expect(r.manaBefore-r.manaAfter).toBe(3);expect(r.rankAtLeastD).toBe(true);expect(r.state.classProgression.cClass.volleyDrill.order).toBe('VOLLEY');expect(r.state.classProgression.cClass.ordinaryVeteranBaseline).toContain('D-equivalent');
});

test('C procurement follows E/D foundation and 600-second ecology keeps C scarce but operationally present',async({page},testInfo)=>{
  test.setTimeout(70000);await openGame(page);
  const r=await page.evaluate(()=>{
    GameTest.setSeed(35303);const api=__battleSim.test,g=api.generals()[0];g.money=10000;
    for(let i=0;i<17;i++)api.buyMusketeer(0,'F');for(let i=0;i<7;i++)api.buyMusketeer(0,'E');api.buyMusketeer(0,'D');
    const procurement=api.procurementRank(0,'CONTEST',80,40);
    GameTest.setSeed(35304);const samples=[];
    for(let i=0;i<20;i++){GameTest.advance(30);const s=GameTest.state();if(i<4)continue;for(let t=0;t<2;t++)if(s.musketeers[t]>=24){const n=s.musketeers[t],e=s.eclass[t],d=s.dclass[t],c=s.cclass[t];samples.push({e:e/n,d:d/n,c:c/n,elite:(e+d+c)/n,cPresent:c>0,army:n})}}
    const mean=k=>samples.reduce((n,x)=>n+x[k],0)/Math.max(1,samples.length),presence=samples.filter(x=>x.cPresent).length/Math.max(1,samples.length),s=GameTest.snapshot();
    return{procurement,sampleCount:samples.length,meanE:mean('e'),meanD:mean('d'),meanC:mean('c'),meanElite:mean('elite'),cPresence:presence,rankPurchases:s.rankPurchases,finalC:s.cclass,validation:GameTest.validate()};
  });
  console.log(`V35_C_ECOLOGY ${JSON.stringify(r)}`);await testInfo.attach('v35-c-ecology.json',{body:Buffer.from(JSON.stringify(r,null,2)),contentType:'application/json'});
  expect(r.validation.ok).toBe(true);expect(r.procurement).toBe('C');expect(r.sampleCount).toBeGreaterThan(10);expect(r.meanE).toBeGreaterThan(.08);expect(r.meanD).toBeGreaterThan(.005);expect(r.meanC).toBeGreaterThan(0);expect(r.cPresence).toBeGreaterThan(.10);expect(r.meanC).toBeLessThan(.12);expect(r.meanElite).toBeLessThan(.55);expect(r.rankPurchases.reduce((n,x)=>n+(x.C||0),0)).toBeGreaterThan(0);
});