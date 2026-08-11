const { test, expect } = require('@playwright/test');

async function openGame(page){
  const response=await page.goto('/',{waitUntil:'domcontentloaded',timeout:30000});expect(response).not.toBeNull();expect(response.status()).toBeLessThan(400);
  await page.waitForFunction(()=>Boolean(window.GameTest&&window.__battleSim),null,{timeout:15000});const pause=page.locator('#pauseBtn');if((await pause.textContent())?.trim()==='Pause')await pause.click();
}

test('organized siege damage is materially stronger while ordinary fortress fire and fortress HP stay unchanged',async({page})=>{
  await openGame(page);const r=await page.evaluate(()=>{GameTest.setSeed(36100);const api=__battleSim.test,g=api.generals()[0];g.money=1000;const a=api.buyMusketeer(0,'F'),c=api.companies()[0][a.company];const ordinary=api.organizedFortDamageRange(a);c.command='SIEGE';const siege=api.organizedFortDamageRange(a);c.command='BREACH';const breach=api.organizedFortDamageRange(a);const s=GameTest.state();return{ordinary,siege,breach,forts:s.fortresses,validation:GameTest.validate()}});
  expect(r.validation.ok).toBe(true);expect(r.ordinary).toEqual([6,10]);expect(r.siege[0]).toBeGreaterThan(r.ordinary[1]);expect(r.breach[0]).toBeGreaterThan(r.siege[1]);expect(r.forts[0].maxHp).toBe(4500);expect(r.forts[1].maxHp).toBe(4500);
});

test('long-war escalation converts old siege seeds into actual first-war resolutions instead of universal 2000s stalemate',async({page},testInfo)=>{
  test.setTimeout(240000);await openGame(page);
  const r=await page.evaluate(()=>{
    const seeds=[32201,32206,32207],out=[];
    for(const seed of seeds){GameTest.setSeed(seed);let firstWinner=-1,firstWinTime=null,maxFortDamage=0,peakSiegePushes=[0,0];for(let t=0;t<2200&&firstWinner===-1;t+=25){GameTest.advance(25);const s=GameTest.state();maxFortDamage=Math.max(maxFortDamage,...s.fortresses.map(f=>f.maxHp-f.hp));peakSiegePushes=peakSiegePushes.map((v,i)=>Math.max(v,s.siegePushes[i]));if(s.warWinner!==-1||s.war>1){firstWinner=s.warWinner!==-1?s.warWinner:(s.warsWon[0]>0?0:s.warsWon[1]>0?1:-1);firstWinTime=s.time}}
      const s=GameTest.snapshot();out.push({seed,firstWinner,firstWinTime,maxFortDamage,peakSiegePushes,warsWon:s.warsWon,war:s.war,validation:GameTest.validate()});}
    return out;
  });
  console.log(`V34_LONG_WAR ${JSON.stringify(r)}`);await testInfo.attach('v34-long-war-resolution.json',{body:Buffer.from(JSON.stringify(r,null,2)),contentType:'application/json'});
  for(const x of r)expect(x.validation.ok).toBe(true);
  const resolved=r.filter(x=>x.firstWinner!==-1||x.warsWon.some(v=>v>0));expect(resolved.length).toBeGreaterThanOrEqual(2);
  expect(r.some(x=>x.firstWinTime!==null&&x.firstWinTime<=2000)).toBe(true);
  expect(r.every(x=>x.maxFortDamage>0||x.firstWinner!==-1||x.warsWon.some(v=>v>0))).toBe(true);
});