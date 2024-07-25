import { launch } from 'puppeteer';
import fs from 'fs';
import 'dotenv/config.js'
import { setLocalStorage } from './utils/userUtils.js';
import { getDate, cleanType } from './utils/businessDataUtil.js';

(async () => {
    const browser = await launch({ headless: false, args: [`--window-size=1920,1080`], defaultViewport: { width: 1920, height: 1080 } });
    const page = await browser.newPage();
    setLocalStorage(page, '.\\data\\user.json');
    await page.goto('https://dev-dmp.meiguanjia.net/report/businessData');

    await page.waitForSelector('.menu-list-second');
    const childElements = await page.$$('.menu-list-second .menu-list-second-item');
    await new Promise(r => setTimeout(r, 1000));
    await childElements[1].click();
    const str = await page.evaluate(node => node.textContent.trim(), childElements[1]);
    console.log(str);

    const file = './data/businessData.json';

    fs.writeFileSync(file, '', 'utf-8');

    await getDate(page, fs, file);
    console.log('========');

    await cleanType(page, '.arco-picker-start-time', '2024-06');
    await getDate(page, fs, file);
    console.log('========');

    await cleanType(page, '.arco-picker-start-time', '2024-05');
    await getDate(page, fs, file);
    console.log('========');

    await cleanType(page, '.arco-picker-start-time', '2024-04');
    await getDate(page, fs, file);
    console.log('========');

    await browser.close();
})();