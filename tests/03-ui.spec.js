const { test, expect } = require('@playwright/test');

async function openGame(page){
  const response=await page.goto('/',{waitUntil:'domcontentloaded',timeout:30000});
  expect(response).not.toBeNull();expect(response.status()).toBeLessThan(400);
  await page.waitForFunction(()=>Boolean(window.GameTest&&window.__battleSim),null,{timeout:15000});
  const pause=page.locator('#pauseBtn');if((await pause.textContent())?.trim()==='Pause')await pause.click();
}

test('primary game UI is battle-first and development chrome is removed',async({page},testInfo)=>{
  await openGame(page);
  await expect(page.locator('header .title')).toHaveText('Musketeer Battle Simulator');
  await expect(page.locator('header .version')).toHaveText('v3.2.1');
  await expect(page.locator('.card')).toHaveCount(0);
  await expect(page.getByText('Phase 3 Rules',{exact:true})).toHaveCount(0);
  await expect(page.getByText('Commander Forms',{exact:true})).toHaveCount(0);
  await expect(page.getByText('Roadmap',{exact:true})).toHaveCount(0);
  await expect(page.getByText('General AIs',{exact:true})).toHaveCount(0);
  await expect(page.locator('#moneyStat [data-side]')).toHaveCount(2);
  await expect(page.locator('#details')).not.toHaveAttribute('open','');
  await expect(page.locator('#pricingStat')).not.toBeVisible();
  await page.locator('#details summary').click();
  await expect(page.locator('#pricingStat')).toBeVisible();
  const p=testInfo.outputPath('ui-clean-desktop.png');
  await page.screenshot({path:p,fullPage:true});
  await testInfo.attach('ui-clean-desktop.png',{path:p,contentType:'image/png'});
});

test('mobile layout keeps battlefield above the information panel without page overflow',async({page},testInfo)=>{
  await page.setViewportSize({width:412,height:915});
  await openGame(page);
  const field=await page.locator('#fieldWrap').boundingBox(),side=await page.locator('#side').boundingBox();
  expect(field).not.toBeNull();expect(side).not.toBeNull();expect(side.y).toBeGreaterThan(field.y);
  const overflow=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,width:innerWidth}));
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.width+1);
  const p=testInfo.outputPath('ui-clean-mobile.png');
  await page.screenshot({path:p,fullPage:true});
  await testInfo.attach('ui-clean-mobile.png',{path:p,contentType:'image/png'});
});
