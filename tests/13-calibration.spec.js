const { test, expect } = require('@playwright/test');

async function openGame(page){
  const response=await page.goto('/',{waitUntil:'domcontentloaded',timeout:30000});
  expect(response).not.toBeNull();expect(response.status()).toBeLessThan(400);
  await page.waitForFunction(()=>Boolean(window.GameTest&&window.__battleSim),null,{timeout:15000});
  const pause=page.locator('#pauseBtn');if((await pause.textContent())?.trim()==='Pause')await pause.click();
}

test('CALIBRATION: zero-maintenance economy stays finite across four 600-second seeds',async({page},testInfo)=>{
  test.setTimeout(360000);await openGame(page);
  const result=await page.evaluate(()=>{
    const out=[];
    for(const seed of[32101,32102,32103,32104]){
      GameTest.setSeed(seed);const maxTreasury=[0,0],maxDShare=[0,0],maxArmy=[0,0],maxCompanies=[0,0];
      for(let i=0;i<20;i++){
        GameTest.advance(30);const s=GameTest.state();
        for(let t=0;t<2;t++){
          maxTreasury[t]=Math.max(maxTreasury[t],s.money[t]);maxArmy[t]=Math.max(maxArmy[t],s.musketeers[t]);maxCompanies[t]=Math.max(maxCompanies[t],s.companies[t].length);maxDShare[t]=Math.max(maxDShare[t],s.musketeers[t]?s.dclass[t]/s.musketeers[t]:0)
        }
      }
      const s=GameTest.snapshot();out.push({seed,validation:GameTest.validate(),maxTreasury,maxDShare,maxArmy,maxCompanies,money:s.money,army:s.musketeers,companyTargets:s.companies.map(cs=>cs.map(c=>c.targetSize)),eclass:s.eclass,dclass:s.dclass,cclass:s.cclass,rankPurchases:s.rankPurchases,ePromotions:s.ePromotions,dPromotions:s.dPromotions,cPromotions:s.cPromotions,netIncome:s.economy.netIncomeRates,upkeep:s.economy.upkeepRates,fortresses:s.fortresses,performance:s.performance})
    }
    return out
  });
  console.log(`V35_ECONOMY_CALIBRATION ${JSON.stringify(result)}`);await testInfo.attach('v35-economy-calibration.json',{body:Buffer.from(JSON.stringify(result,null,2)),contentType:'application/json'});
  expect(result.every(x=>x.validation.ok)).toBe(true);expect(result.every(x=>x.maxArmy.every(v=>v>0&&v<=150))).toBe(true);expect(result.every(x=>x.maxCompanies.every(v=>v<=11))).toBe(true);expect(result.every(x=>x.upkeep.every(v=>v===0))).toBe(true);expect(result.every(x=>x.maxTreasury.every(Number.isFinite))).toBe(true);expect(Math.max(...result.flatMap(x=>x.maxDShare))).toBeLessThan(.45);expect(result.every(x=>x.performance.fullPoolSorts===0)).toBe(true);
});

test('CALIBRATION: natural siege remains possible across nine 900-second seeds',async({page},testInfo)=>{
  test.setTimeout(720000);await openGame(page);
  const result=await page.evaluate(()=>{
    const out=[];
    for(const seed of[32201,32202,32203,32204,32205,32206,32207,32208,32209]){
      GameTest.setSeed(seed);const minDistance=[Infinity,Infinity],peakArmy=[0,0],peakCompanies=[0,0];
      for(let i=0;i<180;i++){
        GameTest.advance(5);const s=GameTest.state();
        for(let t=0;t<2;t++){
          if(s.breachFortDistance[t]!==null)minDistance[t]=Math.min(minDistance[t],s.breachFortDistance[t]);peakArmy[t]=Math.max(peakArmy[t],s.musketeers[t]);peakCompanies[t]=Math.max(peakCompanies[t],s.companies[t].length)
        }
      }
      const s=GameTest.snapshot();out.push({seed,validation:GameTest.validate(),fortressHits:s.fortressHits,minBreachFortDistance:minDistance.map(v=>Number.isFinite(v)?v:null),peakArmy,peakCompanies,targets:s.companies.map(cs=>cs.map(c=>c.targetSize)),dclass:s.dclass,cclass:s.cclass,rankPurchases:s.rankPurchases,fortresses:s.fortresses,performance:s.performance})
    }
    return out
  });
  console.log(`V35_NATURAL_SIEGE ${JSON.stringify(result)}`);await testInfo.attach('v35-natural-siege.json',{body:Buffer.from(JSON.stringify(result,null,2)),contentType:'application/json'});
  expect(result.every(x=>x.validation.ok)).toBe(true);expect(result.every(x=>x.peakArmy.every(v=>v<=150))).toBe(true);expect(result.every(x=>x.peakCompanies.every(v=>v<=11))).toBe(true);expect(result.reduce((n,x)=>n+x.fortressHits[0]+x.fortressHits[1],0)).toBeGreaterThan(0);expect(result.every(x=>x.performance.fullPoolSorts===0)).toBe(true);
});

test('CALIBRATION: user seed 1597106260 resolves the first war by 1800 seconds after near-cap combat',async({page},testInfo)=>{
  test.setTimeout(480000);await openGame(page);
  const r=await page.evaluate(()=>{
    GameTest.setSeed(1597106260);let firstWinner=-1,firstWinTime=null,firstFortDamageTime=null,maxLiving=0,maxTroops=[0,0],maxTreasury=[0,0],maxFortDamage=0;
    for(let t=0;t<1800&&firstWinner===-1;t+=5){
      GameTest.advance(5);const s=GameTest.state(),living=s.musketeers[0]+s.musketeers[1]+s.commanders[0]+s.commanders[1];
      maxLiving=Math.max(maxLiving,living);maxTroops=maxTroops.map((v,i)=>Math.max(v,s.musketeers[i]));maxTreasury=maxTreasury.map((v,i)=>Math.max(v,s.money[i]));maxFortDamage=Math.max(maxFortDamage,...s.fortresses.map(f=>f.maxHp-f.hp));
      if(firstFortDamageTime===null&&maxFortDamage>0)firstFortDamageTime=s.time;
      if(s.warWinner!==-1||s.war>1||s.warsWon.some(v=>v>0)){firstWinner=s.warWinner!==-1?s.warWinner:(s.warsWon[0]>0?0:s.warsWon[1]>0?1:-1);firstWinTime=s.time}
    }
    const s=GameTest.snapshot();return{firstWinner,firstWinTime,firstFortDamageTime,maxLiving,maxTroops,maxTreasury,maxFortDamage,warsWon:s.warsWon,war:s.war,fortresses:s.fortresses,rankPurchases:s.rankPurchases,statSpend:s.statTraining.spend,performance:s.performance,validation:GameTest.validate()}
  });
  console.log(`V35_USER_SEED_1597106260 ${JSON.stringify(r)}`);await testInfo.attach('v35-user-seed-1597106260.json',{body:Buffer.from(JSON.stringify(r,null,2)),contentType:'application/json'});
  expect(r.validation.ok).toBe(true);expect(r.firstWinner).not.toBe(-1);expect(r.firstWinTime).not.toBeNull();expect(r.firstWinTime).toBeLessThanOrEqual(1800);expect(r.firstFortDamageTime).not.toBeNull();expect(r.firstFortDamageTime).toBeLessThanOrEqual(1600);expect(r.maxLiving).toBeGreaterThanOrEqual(280);expect(r.maxTroops.every(v=>v<=150)).toBe(true);expect(r.maxFortDamage).toBeGreaterThan(6000);expect(r.performance.fullPoolSorts).toBe(0);expect(r.performance.maxStepMs).toBeLessThan(100);
});
