import { launch } from 'puppeteer';
import fs from 'fs';
import 'dotenv/config.js'
import { setLocalStorage } from './utils/userUtils.js';
import { setMonthTime, getDate, changeTimeDimension } from './utils/commnUtils.js'

(async () => {
    const browser = await launch({ headless: false, args: [`--window-size=1920,1080`], defaultViewport: { width: 1920, height: 1080 } });
    const page = await browser.newPage();
    setLocalStorage(page, '.\\data\\user.json');
    await page.goto('https://dev-dmp.meiguanjia.net/report/technicianReport');
    // await page.goto('https://boss.aizhb.net/report/businessData');

    await page.waitForSelector('.menu-list-second');
    const childElements = await page.$$('.menu-list-second .menu-list-second-item');
    await new Promise(r => setTimeout(r, 1000));
    await childElements[2].click();
    const str = await page.evaluate(node => node.textContent.trim(), childElements[2]);
    console.log(str);

    const file = './data/technicianReport.json';
    
    fs.writeFileSync(file, '', 'utf-8');
    
    await changeTimeDimension(page, 2);
    await setMonthTime(page, '.arco-picker-start-time', '2024-05');
    await getDate(page, fs, file);

    await browser.close();
})();