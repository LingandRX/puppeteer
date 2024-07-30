import fs from 'fs';

/**
 * 设置页面的LocalStorage
 * @param {*} page 
 * @param {String} file 用户信息
 */
export async function setLocalStorage(page, file) {
    const outputLocalStorge = fs.readFileSync(file, 'utf-8');
    let localStorageTest = JSON.parse(outputLocalStorge);

    // 设置页面的localStorage
    await page.evaluateOnNewDocument(localStorageTest => {
        localStorage.clear();
        localStorage.setItem('merchant_access_token', localStorageTest.merchant_access_token);
        localStorage.setItem('merchant_refresh_token', localStorageTest.merchant_refresh_token);
        localStorage.setItem('merchant_login_data', localStorageTest.merchant_login_data);
        localStorage.setItem('merchant_metadata_data', localStorageTest.merchant_metadata_data);
    }, localStorageTest);

    console.log('set success');
}

/**
 * @param {Page} page 
 * @param {String} webUrl 网站
 * @param {String} cookieFile cookie地址Url
 */
export async function injectionCookie(page, webUrl, cookieFile) {
    try {
        await page.goto(webUrl);
        const cookies = JSON.parse(fs.readFileSync(cookieFile, 'utf-8'));
        await page.setCookie(...cookies);
        await page.goto(webUrl);
    } catch (error) {
        console.error(error);
    }
}