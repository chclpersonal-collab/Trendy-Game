const { test, expect } = require('@playwright/test');

async function openGame(page){
  const response=await page.goto('/',{waitUntil:'domcontentloaded',timeout:30000});
  expect(response).not.toBeNull();expect(response.status()).toBeLessThan(400);
  await page.waitForFunction(()=>Boolean(window.GameTest&&window.__battleSim),null,{timeout:15000});
  const pause=page.locator('#pauseBtn');if((await pause.textContent())?.trim()==='Pause')await pause.click();
}

test('primary game UI is battle-first and exposes real training stats plus instant export',async({page},testInfo)=>{
  await openGame(page);
  await expect(page.locator('header .title')).toHaveText('Musketeer Battle Simulator');
  await expect(page.locator('header .version')).toHaveText('v3.4.1');
  await expect(page.locator('#exportStateBtn')).toBeVisible();
  await expect(page.locator('.card')).toHaveCount(0);
  await expect(page.getByText('Roadmap',{exact:true})).toHaveCount(0);
  await expect(page.locator('#moneyStat [data-side]')).toHaveCount(2);
  await expect(page.locator('#cclassStat [data-side]')).toHaveCount(2);
  await expect(page.locator('#integrityStat > span').first()).toHaveText('Authority');
  await expect(page.locator('#uncommandedStat > span').first()).toHaveText('No authority');
  await expect(page.locator('#budgetStat > span').first()).toHaveText('Budget');
  for(const id of['offenseStat','defenseStat','staminaStat','luckStat','skillStat','localCommandStat'])await expect(page.locator(`#${id}`)).toBeVisible();
  await expect(page.locator('#offenseStat [data-side="left"]')).toHaveText('Lv 1');
  await expect(page.locator('#details')).not.toHaveAttribute('open','');
  await page.locator('#details summary').click();await expect(page.locator('#pricingStat')).toBeVisible();await expect(page.locator('#cPromotionsStat')).toBeVisible();
  const p=testInfo.outputPath('ui-v341-desktop.png');await page.screenshot({path:p,fullPage:true});await testInfo.attach('ui-v341-desktop.png',{path:p,contentType:'image/png'});
});

test('mobile layout keeps battlefield above information panel with the Export State control available',async({page},testInfo)=>{
  await page.setViewportSize({width:412,height:915});await openGame(page);
  const field=await page.locator('#fieldWrap').boundingBox(),side=await page.locator('#side').boundingBox();expect(field).not.toBeNull();expect(side).not.toBeNull();expect(side.y).toBeGreaterThan(field.y);
  await expect(page.locator('#exportStateBtn')).toBeVisible();
  const overflow=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,width:innerWidth}));expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.width+1);
  const p=testInfo.outputPath('ui-v341-mobile.png');await page.screenshot({path:p,fullPage:true});await testInfo.attach('ui-v341-mobile.png',{path:p,contentType:'image/png'});
});