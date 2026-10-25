import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import {routes} from '../src/pages.js';
import {cars,brands} from '../src/catalog.js';
const root='http://127.0.0.1:4173',out='lab/revision-3/full';await fs.mkdir(out,{recursive:true});
const report={checks:[],errors:[],badResponses:[],screenshots:[]};
const check=(name,pass,detail='')=>{report.checks.push({name,pass,detail});if(!pass)console.log('FAIL',name,detail);};
const htmls=new Map();for(const route of routes){const res=await fetch(root+route);const html=await res.text();htmls.set(route,html);check(`direct ${route}`,res.ok&&html.includes(`data-page="${route}"`)&&(html.match(/<h1[ >]/g)||[]).length===1);}
check('94 static pages',routes.length===94);check('72 models',cars.length===72);check('six brands with twelve configurations',brands.length===6&&brands.every(b=>cars.filter(c=>c.brandKey===b.key).length===12));
const hashes=[];for(const car of cars){for(const image of car.images){const file=await fs.readFile(`public${image}`);hashes.push(crypto.createHash('sha256').update(file).digest('hex'));check(`photo ${image}`,file.length>10000&&file[0]===255&&file[1]===216);}check(`${car.id} descriptive page`,htmls.get(car.href).includes(car.description)&&car.description.length>100);}
check('216 different photographs',hashes.length===216&&new Set(hashes).size===216);
const allLinks=[...new Set([...htmls.values()].flatMap(html=>[...html.matchAll(/<a\b[^>]*href="(\/[^"#]*)"/g)].map(m=>m[1].split('?')[0])))];check('all internal destinations exist',allLinks.every(h=>routes.includes(h)));
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const visits=['/','/catalog/','/brands/','/brands/li/','/cars/bmw-530/','/cars/zeekr-001/','/services/','/services/inspection/','/delivery/','/about/','/hub/','/journal/','/journal/cost/','/faq/','/contacts/'];
for(const config of [{name:'desktop',width:1440,height:900},{name:'mobile',width:390,height:844},{name:'compact',width:360,height:640},{name:'reduced',width:1440,height:900,reducedMotion:'reduce'}]){
 const context=await browser.newContext({viewport:{width:config.width,height:config.height},reducedMotion:config.reducedMotion||'no-preference',permissions:['clipboard-read','clipboard-write']});await context.addInitScript(()=>{Element.prototype.requestPointerLock=()=>{};Element.prototype.setPointerCapture=()=>{};});
 const page=await context.newPage();page.on('pageerror',e=>report.errors.push({view:config.name,error:e.message}));page.on('response',r=>{if(r.status()>=400)report.badResponses.push({url:r.url(),status:r.status()});});
 const shot=async name=>{const path=`${out}/${config.name}-${name}.jpg`;await page.screenshot({path,quality:82});report.screenshots.push(path);};
 for(const route of config.name==='compact'?['/','/catalog/','/cars/li-l9/','/contacts/']:visits){
  await page.goto(root+route,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(route==='/'?4200:300);
  check(`${config.name} ${route} no overflow`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),await page.evaluate(()=>`${document.documentElement.scrollWidth}/${innerWidth}`));
  check(`${config.name} ${route} no arrows`,!/[↗↘↙↖←→↑↓⇢⇠]/.test(await page.locator('body').innerText()));
  await shot(route==='/'?'home':route.slice(1).replaceAll('/','-'));
  if(route==='/'){
   check(`${config.name} no hero frame`,await page.locator('.cinematic-hero').evaluate(el=>el.getBoundingClientRect().left===0&&getComputedStyle(el).borderRadius==='0px'));
   check(`${config.name} no playback buttons`,await page.locator('.video-actions,#video-replay,#video-pause').count()===0);
   for(const [label,selector]of [['brands','.brand-band'],['cars','.showroom-section'],['map','.route-section'],['company','.company-teaser'],['fan','.fan-section'],['footer','.site-footer']]){await page.locator(selector).scrollIntoViewIfNeeded();await page.waitForTimeout(1000);await shot(label);}
   if(config.name==='desktop'){
    await page.locator('.fan-deck').scrollIntoViewIfNeeded();await page.waitForTimeout(700);await page.mouse.move(0,0);await shot('fan-before');const before=await page.locator('.spread-card').first().boundingBox();await page.locator('.fan-deck').hover();await page.waitForTimeout(1100);const after=await page.locator('.spread-card').first().boundingBox();await shot('fan-after');check('fan actually separates',Math.abs(after.x-before.x)>120);
    for(const p of [.05,.5,.95]){await page.evaluate(p=>{const el=document.querySelector('.route-section');scrollTo({top:el.offsetTop+(el.offsetHeight-innerHeight)*p,behavior:'instant'});},p);await page.waitForTimeout(700);await shot('route-'+p);const state=await page.locator('.map-route').evaluate(e=>({offset:parseFloat(e.style.strokeDashoffset),top:e.closest('.route-stage').getBoundingClientRect().top,countries:document.querySelectorAll('.country').length}));check(`map ${p} remains pinned`,Math.abs(state.top)<2&&state.countries>150,JSON.stringify(state));}
   }
   await page.locator('.menu-button').click();await page.waitForTimeout(1400);await shot('menu');check(`${config.name} menu opened`,await page.locator('#site-menu').evaluate(d=>d.open));await page.keyboard.press('Escape');await page.waitForTimeout(1300);check(`${config.name} menu closes with focus`,!await page.locator('#site-menu').evaluate(d=>d.open)&&await page.evaluate(()=>document.activeElement.classList.contains('menu-button')));
  }
  if(route==='/catalog/'){
   for(const brand of brands){await page.locator(`[data-brand-filter="${brand.key}"]`).click();await page.waitForTimeout(500);check(`${config.name} ${brand.key} twelve cars`,await page.locator('.catalog-grid .vehicle-card:visible').count()===12);}
   await page.locator('[data-brand-filter="all"]').click();await page.waitForTimeout(400);await page.locator('#car-search').fill('ZZZ-NO-SUCH-CAR');check(`${config.name} empty state`,await page.locator('.catalog-empty').isVisible());await page.locator('[data-reset-filters]').click();await page.waitForTimeout(400);check(`${config.name} reset`,await page.locator('.catalog-grid .vehicle-card:visible').count()===12);await page.locator('[data-catalog-more]').click();check(`${config.name} more works`,await page.locator('.catalog-grid .vehicle-card:visible').count()===24);check(`${config.name} color photos`,await page.locator('.vehicle-photo>img').first().evaluate(e=>getComputedStyle(e).filter==='none'));
  }
  if(route.startsWith('/cars/')){check(`${config.name} full page model`,await page.locator('.model-hero').count()===1&&await page.locator('dialog[open]').count()===0);for(const i of [1,2,0]){await page.locator(`[data-photo="${i}"]`).click();await page.waitForTimeout(config.reducedMotion?100:1000);check(`${config.name} ${route} photo ${i}`,await page.locator('.model-photo-current').evaluate((img,i)=>img.complete&&img.naturalWidth>0&&img.src.endsWith(`-${i+1}.jpg`),i));}await shot(route.split('/')[2]+'-gallery');}
 }
 await page.goto(root+'/contacts/?model=li-l9',{waitUntil:'networkidle'});check(`${config.name} model carried`,await page.locator('select[name="model"]').inputValue()==='li-l9');await page.locator('.inquiry-form button[type="submit"]').click();check(`${config.name} validation`,(await page.locator('.form-status').textContent()).includes('Укажите'));
 await page.locator('[name="name"]').fill('Проверка сайта');await page.locator('[name="contact"]').fill('test@example.com');await page.locator('[name="city"]').fill('Москва');await page.locator('[name="consent"]').check();await page.locator('.inquiry-form button[type="submit"]').click();check(`${config.name} draft prepared`,await page.locator('.draft-result').isVisible()&&(await page.locator('.form-status').textContent()).includes('Ничего не отправлено'));
 check(`${config.name} email contains selected car`,decodeURIComponent(await page.locator('[data-mail-draft]').getAttribute('href')).includes('Li Auto L9 Ultra'));await page.locator('[data-copy-draft]').click();await page.waitForTimeout(400);check(`${config.name} actual clipboard`,(await page.evaluate(()=>navigator.clipboard.readText())).includes('Li Auto L9 Ultra'));
 await page.reload({waitUntil:'networkidle'});check(`${config.name} draft reload`,await page.locator('[name="name"]').inputValue()==='Проверка сайта');await shot('contacts-draft');
 if(config.name==='desktop'){await page.locator('.site-header a[href="/about/"]').click();await page.waitForURL('**/about/');check('animated page navigation',await page.locator('[data-page="/about/"]').count()===1);await page.goBack({waitUntil:'networkidle'});await page.waitForTimeout(500);check('Back has no curtain or open dialog',await page.locator('.page-curtain,dialog[open]').count()===0);}
 await context.close();
}
await browser.close();check('no runtime errors',report.errors.length===0,JSON.stringify(report.errors));check('no broken resources',report.badResponses.length===0,JSON.stringify(report.badResponses));
await fs.writeFile(`${out}/report.json`,JSON.stringify(report,null,2));console.log(JSON.stringify({checks:report.checks.length,passed:report.checks.filter(c=>c.pass).length,failures:report.checks.filter(c=>!c.pass),errors:report.errors,badResponses:report.badResponses,screenshots:report.screenshots.length},null,2));if(report.checks.some(c=>!c.pass))process.exitCode=1;
