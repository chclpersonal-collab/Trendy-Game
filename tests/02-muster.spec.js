const { test, expect } = require('@playwright/test');

test('wiped rich army reports MUSTER BLOCKED during enemy BREACH and recovers after relief',async({page})=>{
  const response=await page.goto('/',{waitUntil:'domcontentloaded',timeout:30000});expect(response).not.toBeNull();expect(response.status()).toBeLessThan(400);
  await page.waitForFunction(()=>Boolean(window.GameTest&&window.__battleSim),null,{timeout:15000});const pause=page.locator('#pauseBtn');if((await pause.textContent())?.trim()==='Pause')await pause.click();
  const r=await page.evaluate(()=>{
    GameTest.setSeed(33005);const api=__battleSim.test,attacker=api.generals()[0],defender=api.generals()[1],c=api.companies()[0][0];attacker.money=1000;defender.money=2305;c.targetSize=6;
    for(let i=0;i<6;i++)api.buyMusketeer(0,'F');
    GameTest.forceBreach(0,0,true);const blockedBeforeDecision=fieldworkMusterBlocked(1);api.generalDecision(1);
    const blocked={plan:defender.budgetPlan,army:GameTest.state().musketeers[1],money:defender.money,fieldwork:fieldworkMusterBlocked(1),beforeDecision:blockedBeforeDecision};
    GameTest.forceStance(0,'CONTEST');api.generalDecision(1);
    const relieved={plan:defender.budgetPlan,army:GameTest.state().musketeers[1],money:defender.money,fieldwork:fieldworkMusterBlocked(1),validation:GameTest.validate()};
    return{blocked,relieved};
  });
  expect(r.relieved.validation.ok).toBe(true);
  expect(r.blocked.beforeDecision).toBe(true);
  expect(r.blocked.fieldwork).toBe(true);
  expect(r.blocked.plan).toBe('MUSTER BLOCKED');
  expect(r.blocked.army).toBe(0);
  expect(r.blocked.money).toBeGreaterThan(2000);
  expect(r.relieved.fieldwork).toBe(false);
  expect(r.relieved.plan).toBe('RECOVER F');
  expect(r.relieved.army).toBe(3);
  expect(r.relieved.money).toBeLessThan(r.blocked.money);
});
