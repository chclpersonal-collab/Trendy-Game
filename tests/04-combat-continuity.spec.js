const { test, expect } = require('@playwright/test');

async function openGame(page){
  const response=await page.goto('/',{waitUntil:'domcontentloaded',timeout:30000});
  expect(response).not.toBeNull();
  expect(response.status()).toBeLessThan(400);
  await page.waitForFunction(()=>Boolean(window.GameTest&&window.__battleSim),null,{timeout:15000});
  const pause=page.locator('#pauseBtn');
  if((await pause.textContent())?.trim()==='Pause') await pause.click();
}

test('nearby cross-lane enemy is noticed and the company closes lateral distance to engage',async({page})=>{
  await openGame(page);
  const r=await page.evaluate(()=>{
    GameTest.setSeed(34001);
    const api=__battleSim.test,left=api.generals()[0],c=api.companies()[0][0];
    left.money=1000;c.targetSize=2;
    const soldier=api.buyMusketeer(0,'F');
    const commander=api.actors().find(a=>a.alive&&a.team===0&&a.isCommander&&a.company===c.id);
    const enemyCommander=api.actors().find(a=>a.alive&&a.team===1&&a.isCommander);
    soldier.x=1500;soldier.y=120;soldier.reload=0;soldier.panic=0;soldier.facing=1;
    commander.x=1470;commander.y=120;
    enemyCommander.x=1530;enemyCommander.y=360;enemyCommander.reload=20;
    const start={x:soldier.x,y:soldier.y,range:Math.hypot(enemyCommander.x-soldier.x,enemyCommander.y-soldier.y)};
    for(let i=0;i<100;i++)api.updateMusketeer(soldier,.05);
    return{start,end:{x:soldier.x,y:soldier.y,reload:soldier.reload,range:Math.hypot(enemyCommander.x-soldier.x,enemyCommander.y-soldier.y)},validation:GameTest.validate()};
  });
  expect(r.validation.ok).toBe(true);
  expect(r.start.range).toBeGreaterThan(205);
  expect(r.end.y).toBeGreaterThan(r.start.y+40);
  expect(r.end.range).toBeLessThan(r.start.range-35);
  expect(r.end.reload).toBeGreaterThan(0);
});

test('RALLY withdrawal can keep moving backward while a loaded musketeer fires',async({page})=>{
  await openGame(page);
  const r=await page.evaluate(()=>{
    GameTest.setSeed(34002);
    const api=__battleSim.test,g0=api.generals()[0],g1=api.generals()[1],c0=api.companies()[0][0],c1=api.companies()[1][0];
    g0.money=1000;g1.money=1000;c0.targetSize=2;c1.targetSize=2;
    const soldier=api.buyMusketeer(0,'F'),enemy=api.buyMusketeer(1,'F');
    const commander=api.actors().find(a=>a.alive&&a.team===0&&a.isCommander&&a.company===c0.id);
    const enemyCommander=api.actors().find(a=>a.alive&&a.team===1&&a.isCommander);
    soldier.x=1500;soldier.y=300;soldier.reload=0;soldier.panic=0;soldier.facing=1;
    commander.x=1470;commander.y=300;
    enemy.x=1620;enemy.y=300;enemy.hp=100;enemy.reload=20;
    enemyCommander.x=2800;enemyCommander.y=500;
    c0.command='RALLY';c0.targetX=1200;c0.rebuilding=true;
    const before={x:soldier.x,hp:enemy.hp};
    api.updateMusketeer(soldier,.1);
    return{before,after:{x:soldier.x,reload:soldier.reload,enemyHp:enemy.hp,facing:soldier.facing},validation:GameTest.validate()};
  });
  expect(r.validation.ok).toBe(true);
  expect(r.after.x).toBeLessThan(r.before.x);
  expect(r.after.facing).toBe(-1);
  expect(r.after.reload).toBeGreaterThan(20);
});

test('withdrawing commander retains danger-close self-defense while staying with the company',async({page})=>{
  await openGame(page);
  const r=await page.evaluate(()=>{
    GameTest.setSeed(34003);
    const api=__battleSim.test,g0=api.generals()[0],g1=api.generals()[1],c0=api.companies()[0][0],c1=api.companies()[1][0];
    g0.money=1000;g1.money=1000;c0.targetSize=2;c1.targetSize=2;
    const m0=[api.buyMusketeer(0,'F'),api.buyMusketeer(0,'F')],enemy=api.buyMusketeer(1,'F');
    const commander=api.actors().find(a=>a.alive&&a.team===0&&a.isCommander&&a.company===c0.id),enemyCommander=api.actors().find(a=>a.alive&&a.team===1&&a.isCommander);
    for(const [i,a] of m0.entries()){a.x=1500;a.y=295+i*10;a.reload=15}
    commander.x=1490;commander.y=300;commander.saberCooldown=0;commander.reload=0;commander.facing=1;
    enemy.x=1525;enemy.y=300;enemy.hp=100;enemy.reload=20;
    enemyCommander.x=2800;enemyCommander.y=500;
    c0.command='RALLY';c0.targetX=1200;c0.rebuilding=true;
    const before={x:commander.x,hp:enemy.hp};
    api.updateCommander(commander,.1);
    return{before,after:{x:commander.x,enemyHp:enemy.hp,facing:commander.facing},validation:GameTest.validate()};
  });
  expect(r.validation.ok).toBe(true);
  expect(r.after.x).toBeLessThan(r.before.x);
  expect(r.after.facing).toBe(-1);
  expect(r.after.enemyHp).toBeLessThan(r.before.hp);
});
