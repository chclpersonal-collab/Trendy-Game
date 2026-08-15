const { test, expect } = require('@playwright/test');

async function openGame(page){
  const response=await page.goto('/',{waitUntil:'domcontentloaded',timeout:30000});
  expect(response).not.toBeNull();expect(response.status()).toBeLessThan(400);
  await page.waitForFunction(()=>Boolean(window.GameTest&&window.__battleSim),null,{timeout:15000});
  const pause=page.locator('#pauseBtn');if((await pause.textContent())?.trim()==='Pause')await pause.click();
}

test('rank procurement treats E and D as separate ecology layers and allows mature non-siege D',async({page})=>{
  await openGame(page);
  const r=await page.evaluate(()=>{
    GameTest.setSeed(34201);
    const api=__battleSim.test,g=api.generals()[0];g.money=10000;
    for(let i=0;i<20;i++)api.buyMusketeer(0,'F');
    const collapsedVeterans=api.procurementRank(0,'CONTEST',80,30);
    for(let i=0;i<4;i++)api.buyMusketeer(0,'E');
    const matureNoD=api.procurementRank(0,'CONTEST',80,30);
    api.buyMusketeer(0,'D');
    const afterFirstD=api.procurementRank(0,'CONTEST',80,30);
    const s=GameTest.state();
    return{collapsedVeterans,matureNoD,afterFirstD,eContest:api.targetEShare('CONTEST'),dDefend:api.targetDShare('DEFEND'),dContest:api.targetDShare('CONTEST'),dSiege:api.targetDShare('SIEGE'),state:s,validation:GameTest.validate()};
  });
  expect(r.validation.ok).toBe(true);
  expect(r.collapsedVeterans).toBe('E');
  expect(r.matureNoD).toBe('D');
  expect(r.afterFirstD).toBe('E');
  expect(r.eContest).toBeCloseTo(.20,8);
  expect(r.dDefend).toBeCloseTo(.03,8);
  expect(r.dContest).toBeCloseTo(.04,8);
  expect(r.dSiege).toBeCloseTo(.06,8);
  expect(r.state.classProgression.rankEcology.separateETarget).toBe(true);
  expect(r.state.classProgression.rankEcology.promotionThresholdsUnchanged).toBe(true);
});

test('E and D obey SIEGE/BREACH discipline but retain autonomous bayonet behavior in ordinary combat',async({page})=>{
  await openGame(page);
  const r=await page.evaluate(()=>{
    GameTest.setSeed(34203);const api=__battleSim.test,g=api.generals()[0],eg=api.generals()[1];g.money=1000;eg.money=1000;
    const e=api.buyMusketeer(0,'E'),enemy=api.buyMusketeer(1,'F'),c=api.companies()[0][0],cmd=api.actors().find(a=>a.alive&&a.team===0&&a.isCommander&&a.company===c.id);
    e.x=1400;e.y=300;enemy.x=1510;enemy.y=300;cmd.x=1380;cmd.y=300;e.reload=10;e.chargeCooldown=0;e.chargeTimer=0;c.command='BREACH';c.targetX=2700;
    const disciplined=api.v321EliteSiegeDiscipline(e);api.updateMusketeer(e,.05);const breachCharge=e.chargeTimer;
    e.chargeTimer=0;e.chargeTarget=0;e.chargeCooldown=0;e.reload=10;enemy.x=e.x+110;enemy.y=e.y;c.command='ADVANCE';
    const ordinaryDisciplined=api.v321EliteSiegeDiscipline(e);api.updateMusketeer(e,.05);const ordinaryCharge=e.chargeTimer;
    return{disciplined,breachCharge,ordinaryDisciplined,ordinaryCharge,state:GameTest.state(),validation:GameTest.validate()};
  });
  expect(r.validation.ok).toBe(true);
  expect(r.disciplined).toBe(true);
  expect(r.breachCharge).toBe(0);
  expect(r.ordinaryDisciplined).toBe(false);
  expect(r.ordinaryCharge).toBeGreaterThan(0);
  expect(r.state.classProgression.eliteSiegeDiscipline.freshAutonomousChargeDuringSiege).toBe(false);
  expect(r.state.classProgression.eliteSiegeDiscipline.ordinaryAutonomousBayonetPreserved).toBe(true);
});

test('600-second rank ecology sample keeps F majority while E is regular and D is actually present',async({page},testInfo)=>{
  test.setTimeout(180000);await openGame(page);
  const r=await page.evaluate(()=>{
    GameTest.setSeed(34202);const samples=[];
    for(let i=0;i<20;i++){
      GameTest.advance(30);const s=GameTest.state();
      if(i<4)continue;
      for(let t=0;t<2;t++)if(s.musketeers[t]>=18){const n=s.musketeers[t],e=s.eclass[t],d=s.dclass[t];samples.push({e:e/n,d:d/n,elite:(e+d)/n,dPresent:d>0,army:n})}
    }
    const mean=k=>samples.reduce((n,x)=>n+x[k],0)/Math.max(1,samples.length),maxElite=Math.max(0,...samples.map(x=>x.elite)),dPresence=samples.filter(x=>x.dPresent).length/Math.max(1,samples.length),s=GameTest.snapshot();
    return{sampleCount:samples.length,meanE:mean('e'),meanD:mean('d'),meanElite:mean('elite'),maxElite,dPresence,rankPurchases:s.rankPurchases,finalE:s.eclass,finalD:s.dclass,validation:GameTest.validate()};
  });
  console.log(`V35_RANK_ECOLOGY ${JSON.stringify(r)}`);
  await testInfo.attach('v35-rank-ecology.json',{body:Buffer.from(JSON.stringify(r,null,2)),contentType:'application/json'});
  expect(r.validation.ok).toBe(true);
  expect(r.sampleCount).toBeGreaterThan(10);
  expect(r.meanE).toBeGreaterThan(.10);
  expect(r.meanD).toBeGreaterThan(.005);
  expect(r.dPresence).toBeGreaterThan(.20);
  expect(r.meanElite).toBeLessThan(.40);
  expect(r.maxElite).toBeLessThan(.50);
  expect(r.rankPurchases.reduce((n,x)=>n+x.D,0)).toBeGreaterThan(0);
});
