import { chromium } from 'playwright-core';
import fs from 'node:fs/promises';
import { cars } from '../src/cars.js';
const url=process.env.TEST_URL||'http://127.0.0.1:5173';
const out=process.env.TEST_OUT||'lab/verification';
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const report={checks:[],errors:[],failedRequests:[],screenshots:[]};
const check=(name,pass,detail='')=>{report.checks.push({name,pass,detail});if(!pass)console.log('FAIL',name,detail);};
for(const config of [{name:'desktop',width:1440,height:900},{name:'mobile',width:390,height:844},{name:'compact',width:360,height:640},{name:'reduced',width:1440,height:900,reducedMotion:'reduce'}]){
 const context=await browser.newContext({viewport:{width:config.width,height:config.height},reducedMotion:config.reducedMotion||'no-preference',permissions:['clipboard-read','clipboard-write']});
 await context.addInitScript(()=>{Element.prototype.requestPointerLock=()=>{};Element.prototype.setPointerCapture=()=>{};});
 const page=await context.newPage();
 page.on('pageerror',e=>report.errors.push({view:config.name,error:e.message}));
 page.on('requestfailed',r=>report.failedRequests.push({view:config.name,url:r.url(),error:r.failure()?.errorText}));
 await page.goto(url,{waitUntil:'networkidle'});
 await page.evaluate(()=>document.fonts.ready);
 await page.waitForTimeout(4300);
 const shot=async name=>{const path=`${out}/${config.name}-${name}.jpg`;await page.screenshot({path,quality:80});report.screenshots.push(path);};
 check(`${config.name} no overflow`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),await page.evaluate(()=>`${document.documentElement.scrollWidth}/${innerWidth}`));
 check(`${config.name} hero readable`,await page.locator('#hero-title').evaluate(e=>getComputedStyle(e).opacity==='1'));
 await shot('hero');
 await page.locator('#menu-toggle').click();await page.waitForTimeout(1200);await shot('menu');
 check(`${config.name} menu open`,await page.locator('#menu').evaluate(e=>e.open));
 await page.keyboard.press('Escape');await page.waitForTimeout(1200);
 check(`${config.name} menu closed`,!await page.locator('#menu').evaluate(e=>e.open));
 check(`${config.name} menu focus restored`,await page.evaluate(()=>document.activeElement.id==='menu-toggle'));
 for(const id of ['about','collection','journey','details','contact']){
  await page.locator(`#${id}`).scrollIntoViewIfNeeded();await page.waitForTimeout(1000);await shot(id);
 }
 if(config.name==='desktop'){
  await page.evaluate(()=>{const el=document.querySelector('#journey');window.scrollTo({top:el.offsetTop+(el.offsetHeight-innerHeight)*.5,behavior:'instant'});});
  await page.waitForTimeout(1000);await shot('journey-middle');
  check('route remains visible in middle',await page.locator('.journey-stage').evaluate(el=>Math.abs(el.getBoundingClientRect().top)<2));
 }
 if(config.name==='desktop'){
  for(const brand of ['bmw','mercedes','porsche']){
   await page.locator(`.filter[data-brand="${brand}"]`).click();await page.waitForTimeout(700);
   check(`${brand} eight models`,await page.locator('.car-card').count()===8);
   const list=cars.filter(car=>car.brandKey===brand);
   for(const car of list){
    await page.locator(`.car-photo[data-open-car="${car.id}"]`).click();await page.waitForTimeout(750);
    check(`${car.id} correct description`,await page.locator('#dialog-description').textContent()===car.description);
    for(let i=0;i<3;i++){
     await page.locator(`[data-angle="${i}"]`).click();await page.locator('#dialog-image').evaluate(img=>img.decode());
     check(`${car.id} photo ${i+1}`,await page.locator('#dialog-image').evaluate(img=>img.complete&&img.naturalWidth>0));
    }
    await page.keyboard.press('Escape');await page.waitForTimeout(350);
   }
  }
  await page.locator('.filter[data-brand="all"]').click();await page.waitForTimeout(700);
  check('default six cards',await page.locator('.car-card').count()===6);
  await page.locator('.load-more').click();check('load more adds six',await page.locator('.car-card').count()===12);
  await page.locator('.filter[data-brand="all"]').click();await page.waitForTimeout(600);
  const photo=page.locator('.car-photo').first();await photo.scrollIntoViewIfNeeded();await page.mouse.move(0,0);await page.waitForTimeout(800);await shot('hover-before');
  await photo.hover({position:{x:180,y:160}});await page.waitForTimeout(900);await shot('hover-after');
  check('hover opens color aperture',await photo.locator('.photo-color').evaluate(e=>getComputedStyle(e).clipPath.includes('145%')));
 }
 await page.locator('.filter[data-brand="bmw"]').click();await page.waitForTimeout(700);
 await page.locator('.car-photo[data-open-car="bmw-530"]').click();await page.waitForTimeout(800);await shot('car-dialog');
 await page.locator('#gallery-next').click();check(`${config.name} gallery changes`,(await page.locator('#dialog-image').getAttribute('src')).includes('-2.jpg'));
 await page.locator('#choose-car').click();await page.waitForTimeout(1200);
 check(`${config.name} chosen car retained`,(await page.locator('#selected-note').textContent()).includes('BMW 530Li'));
 check(`${config.name} email carries model`,decodeURIComponent(await page.locator('#contact-email').getAttribute('href')).includes('BMW 530Li'));
 await page.locator('#copy-email').click();await page.waitForFunction(()=>document.querySelector('#copy-status').textContent.length>0);check(`${config.name} clipboard feedback`,(await page.locator('#copy-status').textContent()).length>0);
 await shot('contact-selected');
 await page.reload({waitUntil:'networkidle'});check(`${config.name} selection survives reload`,(await page.locator('#selected-note').textContent()).includes('BMW 530Li'));
 check(`${config.name} final no overflow`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 if(config.name==='reduced')check('reduced video paused',await page.locator('#arrival').evaluate(v=>v.paused));
 await context.close();
}
await browser.close();
const paths=cars.flatMap(car=>car.images);
check('72 unique catalogue images',new Set(paths).size===72);
for(const path of paths){try{await fs.access(`public${path}`);}catch{check(`missing file ${path}`,false);}}
check('no browser errors',report.errors.length===0,JSON.stringify(report.errors));
check('no failed requests',report.failedRequests.length===0,JSON.stringify(report.failedRequests));
await fs.writeFile(`${out}/report.json`,JSON.stringify(report,null,2));
console.log(JSON.stringify({checks:report.checks.length,passed:report.checks.filter(x=>x.pass).length,failed:report.checks.filter(x=>!x.pass),errors:report.errors,failedRequests:report.failedRequests,shots:report.screenshots.length},null,2));
if(report.checks.some(x=>!x.pass))process.exitCode=1;
