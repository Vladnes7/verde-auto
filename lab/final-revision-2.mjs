import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {routes} from '../src/pages.js';
import {project} from '../src/geography.js';
const origin='http://127.0.0.1:4173';
for(const path of routes){const r=await fetch(origin+path);assert.equal(r.status,200,path);}
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const errors=[];const results=[];
for(const width of [1440,390,360]){
 const page=await browser.newPage({viewport:{width,height:width===360?640:900}});
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(origin,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
 await page.waitForTimeout(4200);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 if(width===1440)await page.screenshot({path:'lab/revision-2/final-home.jpg',quality:85});
 await page.locator('.route-section').scrollIntoViewIfNeeded();await page.waitForTimeout(900);
 const labels=await page.locator('.map-country-label').evaluateAll(els=>els.map(e=>({text:e.textContent,x:+e.getAttribute('x'),y:+e.getAttribute('y')})));
 const expected=project([65,47]);assert.equal(labels[2].text,'КАЗАХСТАН');assert.equal(labels[2].x,expected[0]);assert.equal(labels[2].y,expected[1]);
 assert.ok(await page.locator('.country').count()>150);assert.ok(await page.locator('.map-route').getAttribute('d'));
 await page.screenshot({path:`lab/revision-2/final-map-${width}.jpg`,quality:85});
 results.push({width,overflow:false,countries:await page.locator('.country').count(),labels:labels.map(x=>x.text)});await page.close();
}
await browser.close();assert.deepEqual(errors,[]);
writeFileSync('lab/revision-2/final-smoke.json',JSON.stringify({pages:routes.length,results,errors},null,2));console.log(JSON.stringify({pages:routes.length,viewports:results.length,errors},null,2));
