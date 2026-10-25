import {chromium} from 'playwright-core';
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
await page.goto('http://127.0.0.1:4173/about/',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
await page.evaluate(()=>scrollTo({top:document.querySelector('.full-photo').offsetTop-90,behavior:'instant'}));await page.waitForTimeout(800);
await page.screenshot({path:'lab/revision-3/final-company.jpg',quality:88});
await page.goto('http://127.0.0.1:4173/cars/bmw-x6/',{waitUntil:'networkidle'});await page.screenshot({path:'lab/revision-3/final-x6.jpg',quality:88});
await browser.close();console.log('Saved final company and BMW X6 previews.');
