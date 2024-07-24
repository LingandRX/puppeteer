import { launch } from 'puppeteer';
import 'dotenv/config.js'

(async () => {
    const browser = await launch({ headless: true, args: [`--window-size=1920,1080`], defaultViewport: { width: 1920, height: 1080 } });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    const dev = 'https://dev-dmp.meiguanjia.net/login';
    const stging = 'https://boss.aizhb.net/login';
    let current = '';
    if (process.env.PROFILE === 'dev') {
        current = dev;
    } else if (process.env.PROFILE === 'stging') {
        current = stging;
    }

    console.log(current);
    console.log(process.env.ACCOUNT);
    await page.goto(current);
    await page.locator('#userName input').fill(process.env.ACCOUNT);
    await page.locator('.forgot_box').click();
    await page.waitForSelector('.modify_main');
    await page.locator('#digitalCode input').fill('1');
    await page.locator('#smsCode input').fill(process.env.SMS);
    await page.locator('#newPassWord input').fill(process.env.PASSWORD);
    await page.locator('#confirmPassWord input').fill(process.env.PASSWORD);
    await page.locator('[type="submit"]').click();
    await page.waitForSelector('.arco-message .arco-message-content', { visible: true });
    const arcoMessage = await page.$eval('.arco-message .arco-message-content', node => node.innerHTML);
    await page.screenshot({ path: 'resetPassword.png' });
    console.log(arcoMessage);

    page.on('console', msg => {
        console.log('PAGE:', msg.text())
      })

    await browser.close();
})();