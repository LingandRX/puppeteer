import { launch } from 'puppeteer';
import fs from 'fs';
import 'dotenv/config.js';

import { setLocalStorage } from './utils/userUtils.js';

(async () => {
    const browser = await launch({ headless: false, devtools: true, args: [`--window-size=1920,1080`], defaultViewport: { width: 1920, height: 1080 } });
    const page = await browser.newPage();
    await page.goto('https://dev-dmp.meiguanjia.net/login');

    await setLocalStorage(page, 'user.json');

    await page.goto('https://dev-dmp.meiguanjia.net/report/businessData');

    await browser.close();
})();