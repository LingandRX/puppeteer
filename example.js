import { launch } from 'puppeteer';
import 'dotenv/config.js'
import { injectionCookie } from './utils/userUtils';

(async () => {
    const browser = await launch({ headless: true, args: [`--window-size=1920,1080`], defaultViewport: { width: 1920, height: 1080 } });
    const page = await browser.newPage();

    // 注入cookie
    const webUrl = 'https://www.zhihu.com/hot';
    const cookieFileUrl = './data/zhihu.json';
    await injectionCookie(page, webUrl, cookieFileUrl);

    await browser.close();
})();