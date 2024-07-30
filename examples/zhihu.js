import { launch } from 'puppeteer';
import 'dotenv/config.js'
import { injectionCookie } from '../utils/userUtils.js';
import fs from 'fs';

(async () => {
    const browser = await launch({ headless: false, args: [`--window-size=1920,1080`], defaultViewport: { width: 1920, height: 1080 } });
    const page = await browser.newPage();

    // 注入cookie
    const webUrl = 'https://www.zhihu.com/hot';
    const cookieFileUrl = './data/zhihu.json';
    await injectionCookie(page, webUrl, cookieFileUrl);

    const hotItems = await page.$$('.HotList-list .HotItem');
    console.log("========");

    const hotText = new Array();

    for (const hot in hotItems) {
        if (Object.hasOwnProperty.call(hotItems, hot)) {
            const element = hotItems[hot];

            const h2Element = await element.$('h2');
            const pElement = await element.$('p');

            const title = h2Element != null ? await h2Element.evaluate(e => e.textContent) : '';
            const excerpt = pElement != null ? await pElement.evaluate(e => e.textContent) : '';

            hotText.push({ title, excerpt });
        }
    }
    console.log("end...");

    fs.writeFileSync('./data/zhihuData.json', JSON.stringify(hotText, null, 2));

    await browser.close();
})();