import { launch } from 'puppeteer';
import 'dotenv/config.js'
import { setLocalStorage } from './utils/userUtils.js';

(async () => {
    const browser = await launch({ headless: true, args: [`--window-size=1920,1080`], defaultViewport: { width: 1920, height: 1080 } });
    const page = await browser.newPage();
    setLocalStorage(page, 'user.json');
    await page.goto('https://dev-dmp.meiguanjia.net/report/businessData');
    
    await page.waitForSelector('.menu-list-second');
    const childElements = await page.$$('.menu-list-second .menu-list-second-item');
    await new Promise(r => setTimeout(r, 1000));
    await childElements[1].click();
    const str = await page.evaluate(node => node.textContent.trim(), childElements[1]);
    console.log(str);

    await new Promise(r => setTimeout(r, 1000));
    await page.waitForSelector('.ai_custome');
    const aiCustome = await page.$$('.ai_custome .ai_custome_item');
    for (const e of aiCustome) {
        let str = await page.evaluate(element => element.textContent.trim(), e);
        console.log(str);
    }
    await browser.close();
})();