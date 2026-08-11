const { test, expect } = require('@playwright/test');

test('v3.4.1 exposes real army training, company reform, siege resolution, export diagnostics, and preserves C/Makashi metadata',async({page})=>{
  const response=await page.goto('/',{waitUntil:'domcontentloaded',timeout:30000});
  expect(response).not.toBeNull();expect(response.status()).toBeLessThan(400);
  await page.waitForFunction(()=>Boolean(window.GameTest&&window.__battleSim),null,{timeout:15000});
  const pause=page.locator('#pauseBtn');if((await pause.textContent())?.trim()==='Pause')await pause.click();
  const r=await page.evaluate(()=>{GameTest.setSeed(36000);return GameTest.state()});
  expect(r.version).toBe('3.4');expect(r.phase).toBe(4);expect(r.patchVersion).toBe('3.4.1');
  expect(r.rework).toBe('understrength-company-reform');expect(r.baseRework).toBe('upgradeable-army-stats-siege-resolution-state-export');
  expect(r.classProgression.ePromotionXP).toBe(4);expect(r.classProgression.dPromotionXP).toBe(10);expect(r.classProgression.cPromotionXP).toBe(18);
  expect(r.classProgression.unlocked).toEqual(['F','E','D','C']);expect(r.classProgression.cClass.volleyDrill.order).toBe('VOLLEY');
  expect(r.command.commandAuthority.deathDisrupts).toBe(true);expect(r.command.commandAuthority.replacementRequiresPhysicalJoin).toBe(true);
  expect(r.command.lightsaberForm.unlocked).toEqual(['I Shii-Cho','II Makashi']);expect(r.command.lightsaberForm.formII.projectileDeflection).toBe(false);
  expect(r.armyStats).toEqual([{Offense:1,Defense:1,Stamina:1,Luck:1,Skill:1},{Offense:1,Defense:1,Stamina:1,Luck:1,Skill:1}]);
  expect(r.statTraining.names).toEqual(['Offense','Defense','Stamina','Luck','Skill']);expect(r.statTraining.cap).toBe(20);
  expect(r.companyReform.startsAt).toBe(900);expect(r.companyReform.interval).toBe(20);expect(r.companyReform.maxMergesPerCycle).toBe(3);
  expect(r.companyReform.activeCompanies).toEqual([0,0]);expect(r.companyReform.reserveCompanies).toEqual([0,0]);
  expect(r.siegeResolution.fortressHpUnchanged).toBe(true);expect(r.siegeResolution.breachDamage[0]).toBeGreaterThan(r.siegeResolution.ordinaryDamage[1]);
  expect(r.siegeResolution.companyReformPreventsPermanentRallyFragmentation).toBe(true);
  expect(r.diagnostics.exportAvailable).toBe(true);expect(r.diagnostics.instantCurrentState).toBe(true);
  expect(r.forceFactorModel).toBeUndefined();expect(r.forceFactors).toBeUndefined();
  await expect(page.locator('#exportStateBtn')).toBeVisible();expect(await page.title()).toContain('Phase 4 v3.4.1');expect(await page.locator('.version').textContent()).toContain('v3.4.1');
});