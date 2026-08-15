const { test, expect } = require('@playwright/test');

async function openGame(page){
  const response=await page.goto('/',{waitUntil:'domcontentloaded',timeout:30000});expect(response).not.toBeNull();expect(response.status()).toBeLessThan(400);
  await page.waitForFunction(()=>Boolean(window.GameTest&&window.__battleSim),null,{timeout:15000});const pause=page.locator('#pauseBtn');if((await pause.textContent())?.trim()==='Pause')await pause.click();
}
async function buildCrowdedBattle(page){return page.evaluate(()=>{
  GameTest.setSeed(35110);const api=__battleSim.test,actors=api.actors(),companies=api.companies(),generals=api.generals();
  for(let team=0;team<2;team++){
    generals[team].money=1e6;while(companies[team].length<6)api.createCompany(team,8);for(const c of companies[team]){c.targetSize=8;c.command='ADVANCE';c.targetX=1500}
    const count=team===0?44:39;for(let i=0;i<count;i++)api.buyMusketeer(team,i%19===0?'C':i%11===0?'D':i%5===0?'E':'F');
  }
  for(const a of actors){if(!a.alive)continue;const dir=a.team===0?1:-1,base=a.team===0?1430:1570;a.x=base-dir*((a.company||0)*3+(a.slot||0)*.35);a.y=50+(a.company||0)*88+Math.max(0,a.slot||0)*3.2;if(a.isCommander)a.x-=dir*22}
  api.v351ResetPerformance();return{living:actors.filter(a=>a.alive).length,validation:GameTest.validate()}
})}

test('shield-aware targeting stays bounded for an export-sized 95-actor battle',async({page},testInfo)=>{
  test.setTimeout(30000);await openGame(page);const setup=await buildCrowdedBattle(page);expect(setup.validation.ok).toBe(true);expect(setup.living).toBeGreaterThanOrEqual(90);
  const r=await page.evaluate(()=>{const start=performance.now();GameTest.advance(2);const elapsed=performance.now()-start,s=GameTest.state();return{elapsed,performance:s.performance,validation:GameTest.validate()}});
  console.log(`V351_PERFORMANCE ${JSON.stringify(r)}`);await testInfo.attach('v351-performance.json',{body:Buffer.from(JSON.stringify(r,null,2)),contentType:'application/json'});
  expect(r.validation.ok).toBe(true);expect(r.performance.fullPoolSorts).toBe(0);expect(r.performance.cacheHits).toBeGreaterThan(0);expect(r.performance.lastStepCandidateScores).toBeLessThan(r.performance.livingActors*r.performance.livingActors*4);expect(r.performance.lastStepShieldChecks).toBeLessThan(r.performance.lastStepCandidateScores*12+1);expect(r.elapsed).toBeLessThan(5000);
});

test('4x render loop remains responsive with an export-sized battle',async({page},testInfo)=>{
  test.setTimeout(30000);await openGame(page);const setup=await buildCrowdedBattle(page);expect(setup.validation.ok).toBe(true);
  await page.evaluate(()=>{speed=4;document.getElementById('speedBtn').textContent='Speed 4×';paused=false;document.getElementById('pauseBtn').textContent='Pause'});
  const r=await page.evaluate(()=>new Promise(resolve=>{let frames=0;const start=performance.now();function tick(now){frames++;if(now-start>=1600){paused=true;resolve({frames,wallMs:now-start,state:GameTest.state(),validation:GameTest.validate()})}else requestAnimationFrame(tick)}requestAnimationFrame(tick)}));
  console.log(`V351_FRAME_PROBE ${JSON.stringify({frames:r.frames,wallMs:r.wallMs,performance:r.state.performance})}`);await testInfo.attach('v351-frame-probe.json',{body:Buffer.from(JSON.stringify({frames:r.frames,wallMs:r.wallMs,performance:r.state.performance},null,2)),contentType:'application/json'});
  expect(r.validation.ok).toBe(true);expect(r.frames).toBeGreaterThan(15);expect(r.state.performance.uiIntervalMs).toBe(100);expect(r.state.performance.uiUpdates).toBeLessThanOrEqual(Math.ceil(r.wallMs/100)+2);
});
