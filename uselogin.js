import { launch } from 'puppeteer';
import fs from 'fs';
import 'dotenv/config.js';

import { setLocalStorage } from './utils/userUtils.js';

(async () => {
    const browser = await launch({ headless: false, devtools: true, args: [`--window-size=1920,1080`], defaultViewport: { width: 1920, height: 1080 } });
    const page = await browser.newPage();

    await page.goto('https://www.zhihu.com/hot');
    const outputLocalStorge = fs.readFileSync('./data/zhihu.json', 'utf-8');
    let localStorageTest = JSON.parse(outputLocalStorge);
    let tmpcookies = await page.cookies();
    console.log(tmpcookies);
    await page.deleteCookie(...tmpcookies);
    
    const cookies = new Array();
    for (const iterator in localStorageTest) {
        cookies.push({
            name: iterator,
            value: localStorageTest[iterator],
            domain: '.zhihu.com',
            path: '/',
            httpOnly: true,
            secure: true
        });
        console.log(localStorageTest[iterator]);
    }
    
    console.log(cookies);
    
    await page.setCookie(...cookies);
    
    await page.goto('https://www.zhihu.com/hot');
    // await browser.close();
})();