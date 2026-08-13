const { test, expect } = require('@playwright/test');

async function openGame(page){
  const response=await page.goto('/',{waitUntil:'domcontentloaded',timeout:30000});expect(response).not.toBeNull();expect(response.status()).toBeLessThan(400);
  await page.waitForFunction(()=>Boolean(window.GameTest&&window.__battleSim),null,{timeout:15000});const pause=page.locator('#pauseBtn');if((await pause.textContent())?.trim()==='Pause')await pause.click();
}

test('depleted leading BREACH keeps continuity until a healthy company clearly overtakes it',async({page})=>{
  await openGame(page);
  const r=await page.evaluate(()=>{
    GameTest.setSeed(34210);const api=__battleSim.test,g=api.generals()[0],actors=api.actors(),companies=api.companies()[0],living=id=>actors.filter(a=>a.alive&&a.team===0&&!a.isCommander&&a.company===id),place=(c,x)=>{for(const a of living(c.id))a.x=x+(a.slot||0)*.25;const cmd=actors.find(a=>a.alive&&a.team===0&&a.isCommander&&a.company===c.id);cmd.x=x-24;cmd.joinedCommand=true};
    g.money=5000;const lead=companies[0];lead.targetSize=6;for(let i=0;i<6;i++)api.buyMusketeer(0,'F',true);const challenger=api.createCompany(0,6);for(let i=0;i<6;i++)api.buyMusketeer(0,'F',true);g.stance='SIEGE';g.siegeCommit=420;g.breachCompanyId=lead.id;lead.command='BREACH';challenger.command='SIEGE';place(lead,1500);place(challenger,1550);for(const a of living(lead.id).slice(4))api.killActor(a,null,'test');const before=actors.filter(a=>a.alive).map(a=>({id:a.id,company:a.company,x:a.x,y:a.y})),assignmentsBefore=GameTest.state().breachAssignments[0],retained=api.siegeSpearhead(0);const afterRetain=actors.filter(a=>a.alive).map(a=>({id:a.id,company:a.company,x:a.x,y:a.y}));place(challenger,1700);const handed=api.siegeSpearhead(0),state=GameTest.state(),unchanged=before.every(x=>{const a=afterRetain.find(v=>v.id===x.id);return a&&a.company===x.company&&a.x===x.x&&a.y===x.y});return{lead:lead.id,challenger:challenger.id,leadMen:living(lead.id).length,retained:retained?.id??null,handed:handed?.id??null,assignmentsBefore,assignmentsAfter:state.breachAssignments[0],unchanged,policy:state.siegeResolution.breachContinuityCandidate,validation:GameTest.validate()}
  });
  expect(r.validation.ok).toBe(true);expect(r.leadMen).toBe(4);expect(r.retained).toBe(r.lead);expect(r.handed).toBe(r.challenger);expect(r.assignmentsAfter).toBe(r.assignmentsBefore+1);expect(r.unchanged).toBe(true);expect(r.policy).toMatchObject({selectionMinimum:6,retentionMinimum:3,handoffLead:120,requiresActiveCommand:true,movesExistingSoldiers:false,routesNewRecruits:false,fieldworkBlockMinimumUnchanged:true});
});

test('continuity does not let a sub-six spearhead enforce the fieldwork muster blockade',async({page})=>{
  await openGame(page);
  const r=await page.evaluate(()=>{
    GameTest.setSeed(34211);const api=__battleSim.test,g=api.generals()[0],actors=api.actors(),c=api.companies()[0][0];g.money=1000;c.targetSize=6;for(let i=0;i<6;i++)api.buyMusketeer(0,'F',true);g.stance='SIEGE';g.siegeCommit=420;g.breachCompanyId=c.id;c.command='BREACH';const men=actors.filter(a=>a.alive&&a.team===0&&!a.isCommander&&a.company===c.id);for(const a of men.slice(4))api.killActor(a,null,'test');for(const a of actors.filter(a=>a.alive&&a.team===0&&a.company===c.id))a.x=2000;const retained=api.siegeSpearhead(0);return{retained:retained?.id??null,men:actors.filter(a=>a.alive&&a.team===0&&!a.isCommander&&a.company===c.id).length,blocked:api.fieldworkMusterBlocked(1),validation:GameTest.validate()}
  });
  expect(r.validation.ok).toBe(true);expect(r.men).toBe(4);expect(r.retained).toBe(0);expect(r.blocked).toBe(false);
});
