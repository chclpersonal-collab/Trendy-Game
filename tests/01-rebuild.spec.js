const { test, expect } = require('@playwright/test');

test('adaptive companies rebuild relative to chosen size instead of fixed 4/8 thresholds',async({page})=>{
  const response=await page.goto('/',{waitUntil:'domcontentloaded',timeout:30000});expect(response).not.toBeNull();expect(response.status()).toBeLessThan(400);
  await page.waitForFunction(()=>Boolean(window.GameTest&&window.__battleSim),null,{timeout:15000});const pause=page.locator('#pauseBtn');if((await pause.textContent())?.trim()==='Pause')await pause.click();
  const r=await page.evaluate(()=>{
    GameTest.setSeed(33004);const api=__battleSim.test,g=api.generals()[0],c=api.companies()[0][0];g.money=1000;c.targetSize=2;const a=api.buyMusketeer(0,'F'),b=api.buyMusketeer(0,'F');
    const smallThresholds=companyRebuildThresholds(c);c.commandTimer=.01;api.updateCompanyCommand(0,c,.1);const full={rebuilding:c.rebuilding,command:c.command,men:2};
    api.killActor(b,null,'test');c.commandTimer=.01;api.updateCompanyCommand(0,c,.1);const depleted={rebuilding:c.rebuilding,command:c.command,men:1};
    api.buyMusketeer(0,'F');c.commandTimer=.01;api.updateCompanyCommand(0,c,.1);const restored={rebuilding:c.rebuilding,command:c.command,men:2};
    const large=api.createCompany(0,14),largeThresholds=companyRebuildThresholds(large);
    return{smallThresholds,largeThresholds,full,depleted,restored,validation:GameTest.validate()};
  });
  expect(r.validation.ok).toBe(true);
  expect(r.smallThresholds).toEqual({low:1,ready:2});
  expect(r.largeThresholds).toEqual({low:4,ready:8});
  expect(r.full.rebuilding).toBe(false);
  expect(r.full.command).not.toBe('RALLY');
  expect(r.depleted.rebuilding).toBe(true);
  expect(r.depleted.command).toBe('RALLY');
  expect(r.restored.rebuilding).toBe(false);
  expect(r.restored.command).not.toBe('RALLY');
});
