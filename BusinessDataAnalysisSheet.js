import { launch } from 'puppeteer';
import 'dotenv/config.js'

(async () => {
    const browser = await launch({ headless: true, args: [`--window-size=1920,1080`], defaultViewport: { width: 1920, height: 1080 } });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto('https://dev-dmp.meiguanjia.net/report/businessData');

    console.log(current);
    console.log(process.env.ACCOUNT);

    const item = await page.$eval('.item.cur', node=>node.innerHTML);
    console.log(item);
    // const arcoMessage = await page.$eval('.arco-message .arco-message-content', node => node.innerHTML);
    // await page.screenshot({ path: 'resetPassword.png' });
    console.log(arcoMessage);

    page.on('console', msg => {
        console.log('PAGE:', msg.text())
    })

    await browser.close();
})();