import { chromium } from 'playwright-core';
import fs from 'node:fs/promises';
await fs.mkdir('lab/release',{recursive:true});
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const results=[];
for(const [name,width,height,motion] of [['desktop',1440,900,'no-preference'],['mobile',390,844,'no-preference'],['reduced',1440,900,'reduce']]){
 const context=await browser.newContext({viewport:{width,height},reducedMotion:motion});
 await context.addInitScript(()=>{Element.prototype.requestPointerLock=()=>{};Element.prototype.setPointerCapture=()=>{};});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});await page.waitForTimeout(4800);
 await page.screenshot({path:`lab/release/${name}-hero.jpg`,quality:85});
 if(name==='desktop'){
  for(const p of [.05,.5,.95]){
   await page.evaluate(p=>{const el=document.querySelector('#journey');scrollTo({top:el.offsetTop+(el.offsetHeight-innerHeight)*p,behavior:'instant'});},p);await page.waitForTimeout(1200);
   await page.screenshot({path:`lab/release/route-${p}.jpg`,quality:85});
   results.push(await page.evaluate(()=>({case:'route visible',stageTop:document.querySelector('.journey-stage').getBoundingClientRect().top,headingTop:document.querySelector('.journey-heading').getBoundingClientRect().top,headerBottom:document.querySelector('.header').getBoundingClientRect().bottom,route:document.querySelector('.route-line').style.strokeDashoffset,card:document.querySelector('.delivery-pass').getBoundingClientRect().toJSON()})));
  }
 }
 await page.locator('.car-photo[data-open-car="bmw-530"]').click();await page.waitForTimeout(800);await page.screenshot({path:`lab/release/${name}-gallery.jpg`,quality:85});
 await page.locator('#choose-car').click();await page.waitForTimeout(1000);
 results.push({case:`${name} chosen photo`,pass:await page.locator('.delivery-pass>img').getAttribute('src')==='/media/catalog/bmw-530-1.jpg'});
 if(name==='reduced')results.push({case:'motion-off controls hidden',pass:!await page.locator('.video-actions').isVisible()});
 await page.locator('#menu-toggle').click();await page.waitForTimeout(1300);await page.screenshot({path:`lab/release/${name}-menu.jpg`,quality:85});await page.keyboard.press('Escape');await page.waitForTimeout(1200);
 results.push({case:`${name} no errors`,pass:errors.length===0,errors});
 results.push({case:`${name} no overflow`,pass:await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)});
 await context.close();
}
await browser.close();await fs.writeFile('lab/release/report.json',JSON.stringify(results,null,2));
console.log(JSON.stringify(results));
if(results.some(x=>x.pass===false || x.case==='route visible' && (Math.abs(x.stageTop)>2 || x.headingTop<x.headerBottom)))process.exitCode=1;
