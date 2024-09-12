import { launch } from 'puppeteer';
import fs from 'fs';
import 'dotenv/config.js';
import { injectionCookie } from './utils/userUtils.js';

(async () => {
    const browser = await launch({ headless: false, devtools: true, args: [`--window-size=1920,1080`], defaultViewport: { width: 1920, height: 1080 } });
    const page = await browser.newPage();

    const webUrl = 'https://www.zhihu.com/hot';
    const cookieFileUrl = './data/zhihu.json';
    await injectionCookie(page, webUrl, cookieFileUrl);

    // browser.close();
})();