import { launch } from 'puppeteer';
import fs from 'fs';
import 'dotenv/config.js'
import { setLocalStorage } from './utils/userUtils.js';
import { getDate } from './businessDataUtil.js';

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

    const file = 'businessData.json';//获取file
    fs.writeFileSync(file, '', 'utf-8');

    await getDate(page, fs);
    console.log('========');
    const time = await page.$('.arco-picker-start-time');
    await time.click({ clickCount: 3 });
    await time.type('2024-06', { delay: 100 });
    await getDate(page, fs);
    console.log('========');

    await time.click({ clickCount: 3 });
    await time.type('2024-05', { delay: 100 });
    await getDate(page, fs);
    console.log('========');

    await time.click({ clickCount: 3 });
    await time.type('2024-04', { delay: 100 });
    await getDate(page, fs);
    console.log('========');

    await browser.close();
})();