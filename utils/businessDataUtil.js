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

    const importStorage = JSON.stringify(Array.from(its), null, 2);
    fs.appendFileSync(file, importStorage, 'utf-8');
}

export async function cleanType(page, element, timeContent) {
    const time = await page.$(element);
    await time.click({ clickCount: 3 });
    await time.type(timeContent, { delay: 100 });
}

/**
 * 
 * @param {Page} page 
 * @param {Number} dismensionNumber 
 */
export async function changeTimeDimension(page, dismensionNumber) {
    const timeDimension = [
        '日报',
        '周报',
        '月报',
        '自定义'
    ];

    let rb = await page.$('.arco-space-item .arco-select-view-value');
    let s = await page.evaluate(node => node.textContent.trim(), rb);

    await rb.click();
    const timeMap = new Map();
    rb = await page.$$('.arco-select-dropdown-list .arco-select-option');
    for (const iterator of rb) {
        s = await page.evaluate(node => node.textContent.trim(), iterator)
        timeMap.set(s, iterator);
    }

    await timeMap.get(timeDimension[dismensionNumber]).click();
}