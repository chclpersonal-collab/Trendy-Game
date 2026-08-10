const { test, expect } = require('@playwright/test');

async function openGame(page){
  const response=await page.goto('/',{waitUntil:'domcontentloaded',timeout:30000});
  expect(response).not.toBeNull();
  expect(response.status()).toBeLessThan(400);
  await page.waitForFunction(()=>Boolean(window.GameTest&&window.__battleSim),null,{timeout:15000});
  const pause=page.locator('#pauseBtn');
  if((await pause.textContent())?.trim()==='Pause') await pause.click();
}

test('living commander separation preserves command; commander death causes real command loss',async({page})=>{
  await openGame(page);
  const r=await page.evaluate(()=>{
    GameTest.setSeed(33001);
    const api=__battleSim.test,g=api.generals()[0],eg=api.generals()[1],c=api.companies()[0][0];
    g.money=1000;eg.money=1000;c.targetSize=8;
    const men=[];for(let i=0;i<8;i++)men.push(api.buyMusketeer(0,'F'));
    const target=api.buyMusketeer(1,'F'),cmd=api.actors().find(a=>a.alive&&a.team===0&&a.isCommander&&a.company===c.id),soldier=men[0];
    for(const a of men){a.x=1200;a.y=300+(a.slot-3.5)*5;a.reload=0;a.panic=0}
    soldier.x=1200;soldier.y=300;target.x=1320;target.y=300;
    cmd.x=1175;cmd.y=300;
    const nearAcc=api.shotAccuracy(soldier,target,120);
    cmd.x=1600;
    const far={proximity:api.commanderInCommand(c)===null,source:activeCommandSource(c)===cmd,soldierSource:soldierCommander(soldier)===cmd,integrity:commandIntegrity(0),proximityIntegrity:commandProximityIntegrity(0),accuracy:api.shotAccuracy(soldier,target,120)};
    api.killActor(cmd,null,'test');
    soldier.panic=1;soldier.facing=1;const beforeX=soldier.x;api.updateMusketeer(soldier,.5);
    const dead={source:activeCommandSource(c),soldierSource:soldierCommander(soldier),integrity:commandIntegrity(0),accuracy:api.shotAccuracy(soldier,target,Math.abs(target.x-soldier.x)),beforeX,afterX:soldier.x,facing:soldier.facing,validation:GameTest.validate()};
    return{nearAcc,far,dead};
  });
  expect(r.dead.validation.ok).toBe(true);
  expect(r.far.proximity).toBe(true);
  expect(r.far.source).toBe(true);
  expect(r.far.soldierSource).toBe(true);
  expect(r.far.integrity).toBe(1);
  expect(r.far.proximityIntegrity).toBe(0);
  expect(r.far.accuracy).toBeCloseTo(r.nearAcc,8);
  expect(r.dead.source).toBeNull();
  expect(r.dead.soldierSource).toBeNull();
  expect(r.dead.integrity).toBe(0);
  expect(r.dead.accuracy).toBeLessThan(r.far.accuracy);
  expect(r.dead.afterX).toBeLessThan(r.dead.beforeX);
  expect(r.dead.facing).toBe(-1);
});

test('RALLY withdrawal moves commander and soldiers together and they face the retreat direction',async({page})=>{
  await openGame(page);
  const r=await page.evaluate(()=>{
    GameTest.setSeed(33002);
    const api=__battleSim.test,g=api.generals()[0],c=api.companies()[0][0];g.money=1000;c.targetSize=8;
    const men=[];for(let i=0;i<8;i++)men.push(api.buyMusketeer(0,'F'));
    const cmd=api.actors().find(a=>a.alive&&a.team===0&&a.isCommander&&a.company===c.id);
    for(const a of men){a.x=1500;a.y=300+(a.slot-3.5)*5;a.facing=1;a.reload=10;a.panic=0}
    cmd.x=1510;cmd.y=300;cmd.facing=1;c.command='RALLY';c.targetX=1100;c.rebuilding=true;
    const before={cmdX:cmd.x,menX:men.map(a=>a.x)};
    for(let step=0;step<10;step++){api.updateCommander(cmd,.1);for(const a of men)api.updateMusketeer(a,.1)}
    const center=api.companyCenter(0,c.id),gap=Math.hypot(cmd.x-center.x,cmd.y-center.y);
    return{before,after:{cmdX:cmd.x,menX:men.map(a=>a.x),cmdFacing:cmd.facing,menFacing:men.map(a=>a.facing),panic:men.map(a=>a.panic),gap,source:activeCommandSource(c)===cmd,integrity:commandIntegrity(0)},validation:GameTest.validate()};
  });
  expect(r.validation.ok).toBe(true);
  expect(r.after.cmdX).toBeLessThan(r.before.cmdX);
  expect(r.after.menX.every((x,i)=>x<r.before.menX[i])).toBe(true);
  expect(r.after.cmdFacing).toBe(-1);
  expect(r.after.menFacing.every(v=>v===-1)).toBe(true);
  expect(r.after.panic.every(v=>v===0)).toBe(true);
  expect(r.after.source).toBe(true);
  expect(r.after.integrity).toBe(1);
  expect(r.after.gap).toBeLessThan(80);
});

test('unjoined replacement commander does not restore command or BREACH viability early',async({page})=>{
  await openGame(page);
  const r=await page.evaluate(()=>{
    GameTest.setSeed(33003);
    const api=__battleSim.test,g=api.generals()[0],c=api.companies()[0][0];g.money=1000;c.targetSize=6;
    for(let i=0;i<6;i++)api.buyMusketeer(0,'F');
    const original=api.actors().find(a=>a.alive&&a.team===0&&a.isCommander&&a.company===c.id);api.killActor(original,null,'test');
    const replacement=spawnCommander(0,c,true);replacement.x=300;replacement.y=300;replacement.joinedCommand=false;
    const before={source:activeCommandSource(c),integrity:commandIntegrity(0),breach:assignedBreachStillViable(0,c),joined:replacement.joinedCommand};
    const center=api.companyCenter(0,c.id);replacement.x=center.x;replacement.y=center.y;api.updateCommander(replacement,.01);
    const after={source:activeCommandSource(c)===replacement,integrity:commandIntegrity(0),breach:assignedBreachStillViable(0,c),joined:replacement.joinedCommand,validation:GameTest.validate()};
    return{before,after};
  });
  expect(r.after.validation.ok).toBe(true);
  expect(r.before.source).toBeNull();
  expect(r.before.integrity).toBe(0);
  expect(r.before.breach).toBe(false);
  expect(r.before.joined).toBe(false);
  expect(r.after.joined).toBe(true);
  expect(r.after.source).toBe(true);
  expect(r.after.integrity).toBe(1);
  expect(r.after.breach).toBe(true);
});
