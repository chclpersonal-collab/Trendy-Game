const { test, expect } = require('@playwright/test');

async function openGame(page){
  const response=await page.goto('/',{waitUntil:'domcontentloaded',timeout:30000});expect(response).not.toBeNull();expect(response.status()).toBeLessThan(400);
  await page.waitForFunction(()=>Boolean(window.GameTest&&window.__battleSim),null,{timeout:15000});const pause=page.locator('#pauseBtn');if((await pause.textContent())?.trim()==='Pause')await pause.click();
}

test('new purchases reinforce the active BREACH before depleted rear companies without transferring live soldiers',async({page})=>{
  await openGame(page);
  const r=await page.evaluate(()=>{
    GameTest.setSeed(34110);const api=__battleSim.test,g=api.generals()[0],actors=api.actors(),companies=api.companies()[0],livingIn=id=>actors.filter(a=>a.alive&&a.team===0&&!a.isCommander&&a.company===id);
    g.money=2000;g.reserveTarget=80;
    const breach=companies[0];for(const a of livingIn(breach.id).slice(6))api.killActor(a,null,'test');breach.targetSize=6;while(livingIn(breach.id).length<6)api.buyMusketeer(0,'F',true);
    const rear=api.createCompany(0,14);for(const c of companies)if(c.id!==rear.id)c.targetSize=Math.max(2,livingIn(c.id).length);api.buyMusketeer(0,'F',true);
    const before=livingIn(breach.id).concat(livingIn(rear.id)).map(a=>({id:a.id,company:a.company,x:a.x,y:a.y})),rearBefore=livingIn(rear.id).length;
    g.stance='SIEGE';g.siegeCommit=420;g.targetX=2756;g.breachCompanyId=breach.id;breach.command='BREACH';breach.targetSize=livingIn(breach.id).length;
    const recruit=api.buyMusketeer(0,'F'),afterExisting=before.map(x=>{const a=actors.find(v=>v.id===x.id);return{id:x.id,sameCompany:a.company===x.company,sameX:a.x===x.x,sameY:a.y===x.y}}),state=GameTest.state();
    return{recruitCompany:recruit?.company??null,breachId:breach.id,breachMen:livingIn(breach.id).length,breachTarget:breach.targetSize,rearMen:livingIn(rear.id).length,rearBefore,existingUnchanged:afterExisting.every(x=>x.sameCompany&&x.sameX&&x.sameY),patchVersion:state.patchVersion,policy:state.siegeResolution.breachReinforcement,validation:GameTest.validate()}
  });
  expect(r.validation.ok).toBe(true);expect(r.recruitCompany).toBe(r.breachId);expect(r.breachMen).toBe(7);expect(r.breachTarget).toBe(7);expect(r.rearMen).toBe(r.rearBefore);expect(r.existingUnchanged).toBe(true);expect(r.patchVersion).toBe('3.4.1');expect(r.policy).toMatchObject({targetSize:12,priorityAppliesToAllNewPurchases:true,independentTopOffRank:'F',newRecruitsOnly:true,transfersExistingSoldiers:false,trainingDeferredWhileNeeded:true});
});

test('non-siege recruitment keeps the established first-understrength-company behavior',async({page})=>{
  await openGame(page);
  const r=await page.evaluate(()=>{
    GameTest.setSeed(34111);const api=__battleSim.test,g=api.generals()[0],actors=api.actors(),companies=api.companies()[0],livingIn=id=>actors.filter(a=>a.alive&&a.team===0&&!a.isCommander&&a.company===id);
    g.money=2000;const first=companies[0];first.targetSize=Math.max(2,livingIn(first.id).length);while(livingIn(first.id).length<first.targetSize)api.buyMusketeer(0,'F',true);const rear=api.createCompany(0,8);g.stance='CONTEST';const a=api.buyMusketeer(0,'F');return{company:a?.company??null,rear:rear.id,validation:GameTest.validate()}
  });
  expect(r.validation.ok).toBe(true);expect(r.company).toBe(r.rear);
});
