/**
 * 
 * @param {Page} page 
 * @param {fs} fs 
 * @param {String} file 存储文件位置
 */
export async function getDate(page, fs, file) {
    const its = new Map();

    await new Promise(r => setTimeout(r, 2000));
    await page.waitForSelector('.ai_custome');
    const aiCustome = await page.$$('.ai_custome .ai_custome_item');

    if (aiCustome.length > 0) {
        for (const iterator of aiCustome) {
            const key = await iterator.$('span');
            const value = await iterator.$('div');
            const keyStr = await page.evaluate(element => element.textContent.trim(), key);
            const valueStr = await page.evaluate(element => element.textContent.trim(), value);
            its.set(keyStr, valueStr);
        }
    } else {
        console.log('.ai_custome_item not found');
    }

    const elementHandle = await page.waitForSelector('.bi_warp iframe');
    const frame = await elementHandle.contentFrame();
    await frame.waitForSelector('#label-content');
    const items = await frame.$$('#label-content');

    if (items.length > 0) {
        for (const e of items) {
            const key = await e.$('span p');
            const value = await e.$('span span');
            const keyStr = await frame.evaluate(element => element.textContent.trim(), key);
            const valueStr = await frame.evaluate(element => element.textContent.trim(), value);

            its.set(keyStr, valueStr);
        }
    } else {
        console.log('#label-content not found in the iframe');
    }

    const convert = {};

    for (const [key, value] of its) {
        convert[key] = value;
    }

    console.log(convert);

    const importStorage = JSON.stringify(convert, null, 2);
    fs.appendFileSync(file, importStorage, 'utf-8');
}