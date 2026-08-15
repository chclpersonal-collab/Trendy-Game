const { test, expect } = require('@playwright/test');

async function openGame(page){
  const response=await page.goto('/',{waitUntil:'domcontentloaded',timeout:30000});
  expect(response).not.toBeNull();
  expect(response.status()).toBeLessThan(400);
  await page.waitForFunction(()=>Boolean(window.GameTest&&window.__battleSim),null,{timeout:15000});
  const pause=page.locator('#pauseBtn');
  if((await pause.textContent())?.trim()==='Pause') await pause.click();
}

test('Makashi automatically takes an isolated commander duel and damages only the duel target',async({page})=>{
  await openGame(page);
  const r=await page.evaluate(()=>{
    GameTest.setSeed(34101);
    const api=__battleSim.test,g1=api.generals()[1],c0=api.companies()[0][0],c1=api.companies()[1][0];
    g1.money=1000;c1.targetSize=2;
    const left=api.actors().find(a=>a.alive&&a.team===0&&a.isCommander&&a.company===c0.id);
    const right=api.actors().find(a=>a.alive&&a.team===1&&a.isCommander&&a.company===c1.id);
    const bystander=api.buyMusketeer(1,'F');
    left.x=1500;left.y=300;left.saberCooldown=0;left.reload=10;left.form='I';
    right.x=1538;right.y=300;right.hp=100;right.saberCooldown=10;
    bystander.x=1538;bystander.y=315;bystander.hp=100;bystander.reload=10;
    api.updateCommander(left,.1);
    return{form:left.form,rightHp:right.hp,bystanderHp:bystander.hp,state:GameTest.state(),validation:GameTest.validate()};
  });
  expect(r.validation.ok).toBe(true);
  expect(r.form).toBe('II');
  expect(r.rightHp).toBeLessThan(50);
  expect(r.bystanderHp).toBe(100);
  expect(r.state.command.lightsaberForm.formII.role).toContain('single-target');
  expect(r.state.command.lightsaberForm.formII.projectileDeflection).toBe(false);
});

test('Makashi has stronger single-target commander damage while Shii-Cho remains the crowd form',async({page})=>{
  await openGame(page);
  const r=await page.evaluate(()=>{
    const api=__battleSim.test;
    GameTest.setSeed(34102);
    let c0=api.companies()[0][0],c1=api.companies()[1][0],left=api.actors().find(a=>a.alive&&a.team===0&&a.isCommander),right=api.actors().find(a=>a.alive&&a.team===1&&a.isCommander);
    left.x=1500;left.y=300;left.saberCooldown=0;right.x=1538;right.y=300;right.hp=100;
    api.makashiStrike(left,right);const makashiDamage=100-right.hp;

    GameTest.setSeed(34103);
    c0=api.companies()[0][0];c1=api.companies()[1][0];left=api.actors().find(a=>a.alive&&a.team===0&&a.isCommander);right=api.actors().find(a=>a.alive&&a.team===1&&a.isCommander);
    left.x=1500;left.y=300;left.saberCooldown=0;right.x=1538;right.y=300;right.hp=100;
    api.formISweep(left);const shiiSingleDamage=100-right.hp;

    GameTest.setSeed(34104);
    const g1=api.generals()[1];c0=api.companies()[0][0];c1=api.companies()[1][0];g1.money=1000;c1.targetSize=2;
    left=api.actors().find(a=>a.alive&&a.team===0&&a.isCommander);right=api.actors().find(a=>a.alive&&a.team===1&&a.isCommander);
    const s1=api.buyMusketeer(1,'F'),s2=api.buyMusketeer(1,'F');
    left.x=1500;left.y=300;left.saberCooldown=0;left.form='II';right.x=1537;right.y=300;right.hp=100;s1.x=1538;s1.y=312;s1.hp=100;s2.x=1539;s2.y=288;s2.hp=100;
    api.updateCommander(left,.1);
    const damaged=[right,s1,s2].filter(a=>a.hp<100).length;
    return{makashiDamage,shiiSingleDamage,crowdForm:left.form,crowdDamaged:damaged,validation:GameTest.validate()};
  });
  expect(r.validation.ok).toBe(true);
  expect(r.makashiDamage).toBeGreaterThan(r.shiiSingleDamage+10);
  expect(r.crowdForm).toBe('I');
  expect(r.crowdDamaged).toBeGreaterThanOrEqual(2);
});
