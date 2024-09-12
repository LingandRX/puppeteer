import { launch } from 'puppeteer';
import 'dotenv/config.js'
import { injectionCookie } from '../utils/userUtils.js';

(async () => {
    const browser = await launch({ headless: false, args: [`--window-size=1920,1080`], defaultViewport: { width: 1920, height: 1080 } });
    const page = await browser.newPage();

    // 注入cookie
    const webUrl = 'https://www.zhihu.com/hot';
    const cookieFileUrl = './data/zhihu.json';
    await injectionCookie(page, webUrl, cookieFileUrl);

    const hotItems = await page.$$('.HotList-list .HotItem');
    // console.log(hotItems);
    console.log("========");
    for (const hot in hotItems) {
        if (Object.hasOwnProperty.call(hotItems, hot)) {
            const element = hotItems[hot];
            const textContent = await page.evaluate(node => node.textContent.trim(), element);
            console.log(textContent);
        }
    }

    // await browser.close();
})();