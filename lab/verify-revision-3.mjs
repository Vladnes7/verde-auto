import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';
import {routes} from '../src/pages.js';
import {cars,brands} from '../src/catalog.js';
const root='http://127.0.0.1:4173',out='lab/revision-3';await fs.mkdir(out,{recursive:true});
const results=[],errors=[],badResponses=[];const check=(name,pass,detail='')=>{results.push({name,pass,detail});if(!pass)console.log('FAIL',name,detail);};
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
for(const width of [1440,390]){
 const context=await browser.newContext({viewport:{width,height:900}}),page=await context.newPage();
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)badResponses.push(r.url());});
 const ready=async()=>{await page.waitForLoadState('networkidle');await page.waitForTimeout(550);};
 const section=async path=>{const link=page.locator(`.site-header a[href="${path}"]`);if(await link.isVisible())await link.click();else{await page.locator('.menu-button').click();await page.locator(`.menu-grid a[href="${path}"]`).click();}};
 const noCover=async label=>check(`${width} ${label} has no covering layer`,await page.evaluate(()=>{const x=innerWidth/2,y=innerHeight/2,el=document.elementFromPoint(x,y);return !document.querySelector('dialog[open],.page-curtain')&&el?.closest('#main,.site-header,.site-footer')&&getComputedStyle(document.body).opacity==='1';}));
 await page.goto(root,{waitUntil:'networkidle'});
 await page.locator('.menu-button').click();await page.waitForTimeout(1100);
 let requestTime;page.once('request',()=>requestTime=performance.now());const clickTime=performance.now();await page.locator('.menu-grid a[href="/catalog/"]').click();await page.waitForURL('**/catalog/');
 check(`${width} menu starts navigation without close delay`,requestTime-clickTime<650,`${Math.round(requestTime-clickTime)} ms`);await ready();await noCover('menu destination');
 check(`${width} new page starts at top`,await page.evaluate(()=>scrollY)<10);
 await page.locator('[data-brand-filter="bmw"]').click();await page.locator('.catalog-grid').scrollIntoViewIfNeeded();
 // Interrupt reveals and filters before their normal completion.
 for(const value of ['BMW','X7','BMW','ZZZZ'])await page.locator('#car-search').fill(value);
 await page.locator('[data-reset-filters]').click();await page.locator('[data-brand-filter="bmw"]').click();await page.waitForTimeout(650);
 check(`${width} all twelve BMW visible`,await page.locator('.catalog-grid .vehicle-card:visible').count()===12);
 check(`${width} interrupted filters do not leave faded cards`,await page.locator('.catalog-grid .vehicle-card:visible').evaluateAll(els=>els.every(e=>getComputedStyle(e).opacity==='1')));
 await page.screenshot({path:`${out}/bmw-${width}.jpg`,quality:85});
 await page.locator('a.vehicle-photo[href="/cars/bmw-x7/"]').click();await page.waitForURL('**/cars/bmw-x7/');await ready();await noCover('new BMW');
 check(`${width} BMW image loaded`,await page.locator('.model-photo-current').evaluate(e=>e.complete&&e.naturalWidth>0));
 await page.goBack({waitUntil:'domcontentloaded'});await ready();await noCover('Back');
 check(`${width} Back cards fully opaque`,await page.locator('.catalog-grid .vehicle-card:visible').evaluateAll(els=>els.every(e=>getComputedStyle(e).opacity==='1')));
 await page.locator('.site-footer a[href="/brands/bmw/"]').click();await page.waitForURL('**/brands/bmw/');await ready();await page.locator('[data-brand-filter="all"]').click();await page.waitForURL('**/catalog/');await ready();await noCover('all cars from BMW');
 await page.locator('.catalog-grid .vehicle-photo').first().click();await page.waitForURL('**/cars/bmw-530/');await ready();await noCover('model from catalog');
 await section('/brands/');await page.waitForURL('**/brands/');await ready();await noCover('header transition');
 await page.locator('.site-footer a[href="/brands/mercedes/"]').click();await page.waitForURL('**/brands/mercedes/');await ready();
 await page.locator('a.vehicle-photo[href="/cars/mercedes-eqe/"]').click();await page.waitForURL('**/cars/mercedes-eqe/');await ready();await noCover('reported Mercedes EQE');
 await page.screenshot({path:`${out}/eqe-${width}.jpg`,quality:85});
 await section('/about/');await page.waitForURL('**/about/');await ready();
 for(const image of ['/media/salon-facade.jpg','/media/salon-lounge.jpg','/media/salon-handover.jpg']){const img=page.locator(`img[src="${image}"]`);await img.scrollIntoViewIfNeeded();check(`${width} ${image}`,await img.evaluate(async e=>{try{await e.decode();return e.naturalWidth>0;}catch{return false;}}));}
 await page.locator('.company-gallery').scrollIntoViewIfNeeded();await page.screenshot({path:`${out}/salon-${width}.jpg`,quality:85});
 check(`${width} company no overflow`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 const link=page.locator('.footer-columns a[href="/hub/"]');await link.scrollIntoViewIfNeeded();await link.hover();await page.waitForTimeout(350);
 check(`${width} footer hover underline`,await link.evaluate(e=>getComputedStyle(e,'::after').transform==='matrix(1, 0, 0, 1, 0, 0)'));
 await context.close();
}
// New model layouts, assets, and direct page rendering, including long configuration names.
const page=await browser.newPage({viewport:{width:360,height:740}});page.on('pageerror',e=>errors.push(e.message));
for(const c of cars.slice(48)){await page.goto(root+c.href,{waitUntil:'networkidle'});check(`${c.id} mobile layout`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));check(`${c.id} full photo`,await page.locator('.model-photo-current').evaluate(e=>e.complete&&e.naturalWidth>0));}
check('94 independent routes',routes.length===94);check('72 cars and configurations',cars.length===72);check('12 per brand',brands.every(b=>cars.filter(c=>c.brandKey===b.key).length===12));
await browser.close();check('no runtime errors',errors.length===0,JSON.stringify(errors));check('no resource failures',badResponses.length===0,JSON.stringify(badResponses));
const report={results,errors,badResponses};await fs.writeFile(`${out}/report.json`,JSON.stringify(report,null,2));console.log(JSON.stringify({checks:results.length,passed:results.filter(r=>r.pass).length,failures:results.filter(r=>!r.pass),errors,badResponses},null,2));if(results.some(r=>!r.pass))process.exitCode=1;
