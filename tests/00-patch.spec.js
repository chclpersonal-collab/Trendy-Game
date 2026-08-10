const { test, expect } = require('@playwright/test');

test('v3.1.1 command-continuity patch metadata is live',async({page})=>{
  const response=await page.goto('/',{waitUntil:'domcontentloaded',timeout:30000});
  expect(response).not.toBeNull();expect(response.status()).toBeLessThan(400);
  await page.waitForFunction(()=>Boolean(window.GameTest&&window.__battleSim),null,{timeout:15000});
  const pause=page.locator('#pauseBtn');if((await pause.textContent())?.trim()==='Pause')await pause.click();
  const r=await page.evaluate(()=>{GameTest.setSeed(33000);return GameTest.state()});
  expect(r.version).toBe('3.1');
  expect(r.patchVersion).toBe('3.1.1');
  expect(r.rework).toBe('command-continuity-coordinated-withdrawal');
  expect(r.command.commandAuthority.deathDisrupts).toBe(true);
  expect(r.command.commandAuthority.livingRetreatDisrupts).toBe(false);
  expect(r.command.commandAuthority.replacementRequiresPhysicalJoin).toBe(true);
  expect(r.command.commandAuthority.withdrawalFacesMovement).toBe(true);
  expect(await page.title()).toContain('Phase 3 v3.1.1');
});
