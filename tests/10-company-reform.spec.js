const { test, expect } = require('@playwright/test');

async function openGame(page){
  const response=await page.goto('/',{waitUntil:'domcontentloaded',timeout:30000});expect(response).not.toBeNull();expect(response.status()).toBeLessThan(400);
  await page.waitForFunction(()=>Boolean(window.GameTest&&window.__battleSim),null,{timeout:15000});const pause=page.locator('#pauseBtn');if((await pause.textContent())?.trim()==='Pause')await pause.click();
}

test('reinforcement completes the closest-to-ready rebuilding company instead of starving later commands',async({page})=>{
  await openGame(page);
  const r=await page.evaluate(()=>{
    GameTest.setSeed(36401);const api=__battleSim.test,g=api.generals()[0],c0=api.companies()[0][0];g.money=10000;c0.targetSize=10;const c1=api.createCompany(0,10);
    for(let i=0;i<6;i++)api.buyMusketeer(0,'F');
    const fromC0=api.actors().find(a=>a.alive&&!a.isCommander&&a.team===0&&a.company===c0.id);api.transferSoldierToCompany(fromC0,c1);
    c0.rebuilding=true;c1.rebuilding=true;
    const before=[api.actors().filter(a=>a.alive&&!a.isCommander&&a.team===0&&a.company===c0.id).length,api.actors().filter(a=>a.alive&&!a.isCommander&&a.team===0&&a.company===c1.id).length];
    const bought=api.buyMusketeer(0,'F');
    const after=[api.actors().filter(a=>a.alive&&!a.isCommander&&a.team===0&&a.company===c0.id).length,api.actors().filter(a=>a.alive&&!a.isCommander&&a.team===0&&a.company===c1.id).length];
    return{before,after,boughtCompany:bought.company,deficits:[api.companyReadyDeficit(c0),api.companyReadyDeficit(c1)],validation:GameTest.validate()};
  });
  expect(r.validation.ok).toBe(true);expect(r.before).toEqual([2,4]);expect(r.boughtCompany).toBe(1);expect(r.after).toEqual([2,5]);expect(r.deficits[1]).toBeLessThan(r.deficits[0]);
});

test('depleted companies consolidate without creating troops and empty reserve commands are reused only after active companies fill',async({page})=>{
  await openGame(page);
  const r=await page.evaluate(()=>{
    GameTest.setSeed(36402);const api=__battleSim.test,g=api.generals()[0],c0=api.companies()[0][0];g.money=10000;c0.targetSize=10;const c1=api.createCompany(0,10);
    for(let i=0;i<6;i++)api.buyMusketeer(0,i===0?'E':'F');
    c0.rebuilding=true;c1.rebuilding=true;
    const idsBefore=api.actors().filter(a=>a.alive&&!a.isCommander&&a.team===0).map(a=>a.id).sort((a,b)=>a-b),totalBefore=idsBefore.length,eBefore=GameTest.state().eclass[0];
    const reform=api.consolidateUnderstrengthCompanies(0,true),afterReform=GameTest.state(),countsAfter=afterReform.companies[0].slice(0,2).map(c=>c.men),reserveAfter=afterReform.companies[0].slice(0,2).map(c=>c.reserve);
    const active=api.companies()[0].find(c=>!c.reserve&&api.actors().filter(a=>a.alive&&!a.isCommander&&a.team===0&&a.company===c.id).length>0),reserve=api.companies()[0].find(c=>c.reserve);
    while(api.actors().filter(a=>a.alive&&!a.isCommander&&a.team===0&&a.company===active.id).length<active.targetSize)api.buyMusketeer(0,'F');
    const revival=api.buyMusketeer(0,'F'),final=GameTest.state(),idsAfter=api.actors().filter(a=>a.alive&&!a.isCommander&&a.team===0).map(a=>a.id).sort((a,b)=>a-b);
    return{reform,countsAfter,reserveAfter,totalBefore,totalAfterReform:afterReform.musketeers[0],sameOriginalIds:idsBefore.every(id=>idsAfter.includes(id)),eBefore,eAfter:afterReform.eclass[0],activeId:active.id,reserveId:reserve.id,revivalCompany:revival.company,finalReactivations:final.companyReform.reserveReactivations[0],finalReserve:final.companies[0].find(c=>c.id===reserve.id).reserve,validation:GameTest.validate()};
  });
  expect(r.validation.ok).toBe(true);expect(r.reform).toEqual({merges:1,moved:3});expect(r.countsAfter).toEqual([6,0]);expect(r.reserveAfter).toEqual([false,true]);
  expect(r.totalAfterReform).toBe(r.totalBefore);expect(r.sameOriginalIds).toBe(true);expect(r.eAfter).toBe(r.eBefore);
  expect(r.revivalCompany).toBe(r.reserveId);expect(r.finalReactivations).toBe(1);expect(r.finalReserve).toBe(false);
});