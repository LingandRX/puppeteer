import { launch } from 'puppeteer';
import fs from 'fs';
import 'dotenv/config.js';

(async () => {
    const browser = await launch({ headless: false, args: [`--window-size=1920,1080`], defaultViewport: { width: 1920, height: 1080 } });
    const page = await browser.newPage();
    await page.goto('https://dev-dmp.meiguanjia.net/login');
    // await page.goto('https://boss.aizhb.net/login');
    await page.locator('#userName input').fill(process.env.ACCOUNT);
    await page.locator('#passWord input').fill(process.env.PASSWORD);
    await page.locator('[type="submit"]').click();

    await page.waitForSelector('.arco-message .arco-message-content', { visible: true });
    const arcoMessage = await page.$eval('.arco-message .arco-message-content', node => node.innerHTML);
    console.log(arcoMessage);

    await new Promise(r => setTimeout(r, 1000));
    const localStorage = await page.evaluate(() => Object.assign({}, window.localStorage));

    const importStorage = JSON.stringify(localStorage);
    const file = './data/user.json';
    if (!fs.existsSync('./data/')) {
        fs.mkdirSync('./data/');
        console.log('文件夹不存在，创建文件夹');
    }
    fs.writeFileSync(file, importStorage, 'utf-8');
    await browser.close();
})();