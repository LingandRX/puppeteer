import { launch } from 'puppeteer';
import 'dotenv/config.js'

(async () => {
    const browser = await launch({ headless: true, args: [`--window-size=1920,1080`], defaultViewport: { width: 1920, height: 1080 } });
    const page = await browser.newPage();
    await page.goto('https://dev-dmp.meiguanjia.net/login');
    await page.locator('#userName input').fill(process.env.ACCOUNT);
    await page.locator('#passWord input').fill(process.env.PASSWORD);
    await page.locator('[type="submit"]').click();

    await page.waitForSelector('.arco-modal', { visible: true });
    await page.locator('.arco-list-content:first-child .role_box').click();

    await page.waitForSelector('.arco-message .arco-message-content', { visible: true });
    const arcoMessage = await page.$eval('.arco-message .arco-message-content', node => node.innerHTML);
    console.log(arcoMessage);

    await page.waitForSelector('.menu-list-second');
    const childElements = await page.$$('.menu-list-second .menu-list-second-item');
    await new Promise(r => setTimeout(r, 1000));
    await childElements[1].click();
    const str = await page.evaluate(node => node.textContent.trim(), childElements[1]);
    console.log(str);

    await new Promise(r => setTimeout(r, 1000));
    await page.waitForSelector('.ai_custome');
    const aiCustome = await page.$$('.ai_custome .ai_custome_item');
    for (const e of aiCustome) {
        let str = await page.evaluate(element => element.textContent.trim(), e);
        console.log(str);
    }
    await browser.close();
})();