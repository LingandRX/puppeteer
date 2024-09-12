import { launch } from "puppeteer";
import "dotenv/config.js";
import { injectionCookie } from "../utils/userUtils.js";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

(async () => {
    const browser = await launch({
        headless: false,
        args: [`--window-size=1920,1080`],
        defaultViewport: { width: 1920, height: 1080 },
    });
    const page = await browser.newPage();
    page.on("console", msg => console.log("PAGE LOG", msg.text()));
    page.on("error", error => console.error("PAGE error", error));

    // 注入cookie
    const webUrl = "https://www.zhihu.com/hot";
    const cookieFileUrl = "./data/zhihu.json";
    await injectionCookie(page, webUrl, cookieFileUrl);

    const hotItems = await page.$$(".HotList-list .HotItem");

    const hotText = new Array();

    for (const hot in hotItems) {
        if (Object.hasOwnProperty.call(hotItems, hot)) {
            const element = hotItems[hot];

            const h2Element = await element.$("h2");
            const pElement = await element.$("p");

            const title = h2Element != null ? await h2Element.evaluate(e => e.textContent) : "";
            const excerpt = pElement != null ? await pElement.evaluate(e => e.textContent) : "";
            const createTime = Date.now();
            hotText.push({ title, excerpt, createTime });
        }
    }

    fs.writeFileSync("./data/zhihuData.json", JSON.stringify(hotText, null, 2));

    const url = process.env.URL;
    console.log(process.env.URL);

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(hotText, null, 2),
        });

        if (!response.ok) {
            throw new Error(`Http error! status : ${response.status}`);
        }

        const responseData = await response.json();
        console.log("Repsonse data", responseData);
    } catch (error) {
        console.error(error);
    }

    await browser.close();
})();
