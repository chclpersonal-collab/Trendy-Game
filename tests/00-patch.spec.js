const { test, expect } = require('@playwright/test');

test('v3.2.1 rank ecology patch preserves Makashi and tactical combat metadata',async({page})=>{
  const response=await page.goto('/',{waitUntil:'domcontentloaded',timeout:30000});
  expect(response).not.toBeNull();expect(response.status()).toBeLessThan(400);
  await page.waitForFunction(()=>Boolean(window.GameTest&&window.__battleSim),null,{timeout:15000});
  const pause=page.locator('#pauseBtn');if((await pause.textContent())?.trim()==='Pause')await pause.click();
  const r=await page.evaluate(()=>{GameTest.setSeed(34000);return GameTest.state()});
  expect(r.version).toBe('3.2');
  expect(r.patchVersion).toBe('3.2.1');
  expect(r.rework).toBe('rank-ecology-balance');
  expect(r.classProgression.ePromotionXP).toBe(4);
  expect(r.classProgression.dPromotionXP).toBe(10);
  expect(r.classProgression.rankEcology.model).toContain('E regular');
  expect(r.classProgression.rankEcology.eTargets.CONTEST).toBeCloseTo(.20,8);
  expect(r.classProgression.rankEcology.dTargets.CONTEST).toBeCloseTo(.04,8);
  expect(r.classProgression.rankEcology.dTargets.SIEGE).toBeCloseTo(.06,8);
  expect(r.command.commandAuthority.deathDisrupts).toBe(true);
  expect(r.command.commandAuthority.livingRetreatDisrupts).toBe(false);
  expect(r.command.commandAuthority.replacementRequiresPhysicalJoin).toBe(true);
  expect(r.command.commandAuthority.withdrawalFacesMovement).toBe(true);
  expect(r.command.combatContinuity.crossLaneAwareness.requiresLocalCommand).toBe(true);
  expect(r.command.combatContinuity.withdrawal.genericFMelee).toBe(false);
  expect(r.command.lightsaberForm.unlocked).toEqual(['I Shii-Cho','II Makashi']);
  expect(r.command.lightsaberForm.formII.projectileDeflection).toBe(false);
  expect(await page.title()).toContain('Phase 3 v3.2.1');
  expect(await page.locator('.version').textContent()).toContain('v3.2.1');
});
