import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';
import {routes,renderRoute} from '../src/pages.js';
const out='lab/faq-hero';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const checks=[],errors=[];const check=(name,pass,detail='')=>{checks.push({name,pass,detail});if(!pass)console.log('FAIL',name,detail);};
const faqRoutes=routes.filter(r=>renderRoute(r).includes('class="faq-list"'));
for(const config of [{width:1440,height:900},{width:390,height:844},{width:360,height:640},{width:1440,height:900,reduced:true}]){
 const context=await browser.newContext({viewport:{width:config.width,height:config.height},reducedMotion:config.reduced?'reduce':'no-preference'}),page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 const label=`${config.width}${config.reduced?' reduced':''}`;
 await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(3200);
 const hero=await page.locator('.hero-copy').evaluate(e=>({title:e.querySelector('h1').innerText.replace(/\s+/g,' '),width:document.documentElement.scrollWidth,viewport:innerWidth,cta:e.querySelector('.action').getBoundingClientRect().bottom,foot:document.querySelector('.hero-foot').getBoundingClientRect().top}));
 check(`${label} title`,hero.title==='ДОСТАВКА АВТОМОБИЛЕЙ из Китая.',hero.title);check(`${label} hero fits`,hero.width<=hero.viewport&&hero.cta<hero.foot,JSON.stringify(hero));
 await page.screenshot({path:`${out}/hero-${label}.jpg`,quality:85});
 for(const route of faqRoutes){
  if(route!=='/')await page.goto('http://127.0.0.1:4173'+route,{waitUntil:'networkidle'});
  const item=page.locator('.faq-list details').first(),summary=item.locator('summary');await item.scrollIntoViewIfNeeded();
  const closed=await item.evaluate(e=>e.getBoundingClientRect().height);await summary.click();await page.waitForTimeout(config.reduced?0:45);
  if(!config.reduced)check(`${label} ${route} animates open`,await item.evaluate((e,h)=>e.style.height!==''&&e.getBoundingClientRect().height>h,closed));
  await page.waitForTimeout(260);const opened=await item.evaluate(e=>({height:e.getBoundingClientRect().height,open:e.open,clean:!e.style.height}));check(`${label} ${route} opens`,opened.open&&opened.height>closed&&opened.clean);
  await summary.click();await page.waitForTimeout(config.reduced?0:45);
  if(!config.reduced)check(`${label} ${route} animates closed`,await item.evaluate((e,h)=>e.open&&e.getBoundingClientRect().height<h&&e.style.height!=='',opened.height));
  await page.waitForTimeout(260);check(`${label} ${route} closes`,await item.evaluate((e,h)=>!e.open&&!e.style.height&&Math.abs(e.getBoundingClientRect().height-h)<2,closed));
  await summary.click();await page.waitForTimeout(25);await summary.click();await page.waitForTimeout(25);await summary.click();await page.waitForTimeout(260);check(`${label} ${route} rapid reversal`,await item.evaluate(e=>e.open&&!e.style.height));
  await summary.press('Space');await page.waitForTimeout(260);check(`${label} ${route} Space closes`,await item.evaluate(e=>!e.open));await summary.press('Enter');await page.waitForTimeout(260);check(`${label} ${route} Enter opens`,await item.evaluate(e=>e.open));
  check(`${label} ${route} no overflow`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  if(route==='/faq/')await page.screenshot({path:`${out}/faq-${label}.jpg`,quality:85});
 }
 await context.close();
}
await browser.close();check('no runtime errors',errors.length===0,JSON.stringify(errors));await fs.writeFile(`${out}/report.json`,JSON.stringify({checks,errors},null,2));console.log(JSON.stringify({faqRoutes,checks:checks.length,passed:checks.filter(c=>c.pass).length,failures:checks.filter(c=>!c.pass),errors},null,2));if(checks.some(c=>!c.pass))process.exitCode=1;
