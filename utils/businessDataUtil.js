export async function getDate(page, fs, file) {
    await new Promise(r => setTimeout(r, 2000));
    await page.waitForSelector('.ai_custome');
    const aiCustome = await page.$$('.ai_custome .ai_custome_item .amount');
    let ai = new Set();
    for (const e of aiCustome) {
        let str = await page.evaluate(element => element.textContent, e);
        ai.add(str);
    }

    let importStorage = '\n' + JSON.stringify(Array.from(ai)) + '\n';
    fs.appendFileSync(file, importStorage, 'utf-8');

    const elementHandle = await page.waitForSelector('.bi_warp iframe');
    const frame = await elementHandle.contentFrame();
    await frame.waitForSelector('#label-content');
    const items = await frame.$$('#label-content'); // Use $$ to get all matching elements
    let its = new Set();
    if (items.length > 0) { // Check if items array is not empty
        for (const e of items) {
            let str = await frame.evaluate(element => element.textContent, e); // Use frame.evaluate() here
            its.add(str.replace(/\s+/g, ' '));
        }
    } else {
        console.log('#label-content not found in the iframe');
    }

    importStorage = JSON.stringify(Array.from(its)) + '\n';
    fs.appendFileSync(file, importStorage, 'utf-8');
}

export async function cleanType(page, element, timeContent) {
    const time = await page.$(element);
    await time.click({ clickCount: 3 });
    await time.type(timeContent, { delay: 100 });
}