import { launch } from 'puppeteer';
import fs from 'fs';
import 'dotenv/config.js';

(async () => {
    const browser = await launch({ headless: false, devtools: true, args: [`--window-size=1920,1080`], defaultViewport: { width: 1920, height: 1080 } });
    const page = await browser.newPage();
    await page.goto('https://dev-dmp.meiguanjia.net/login');

    const file = 'user.json';//获取file
    const outputLocalStorge = fs.readFileSync(file, 'utf-8');
    let localStorageTest = JSON.parse(outputLocalStorge);


    // 设置页面的localStorage
    await page.evaluateOnNewDocument(localStorageTest => {
        localStorage.clear();
        localStorage.setItem('merchant_access_token', localStorageTest.merchant_access_token);
        localStorage.setItem('merchant_refresh_token', localStorageTest.merchant_refresh_token);
        localStorage.setItem('merchant_login_data', localStorageTest.merchant_login_data);
        localStorage.setItem('merchant_metadata_data', localStorageTest.merchant_metadata_data);
    }, localStorageTest);
    await page.goto('https://dev-dmp.meiguanjia.net/report/businessData');

    await browser.close();
})();