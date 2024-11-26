const puppeteer = require("puppeteer")

async function captureScreenShot(params) {

    const browser = await puppeteer.launch({headless: false})
    const page = await browser.newPage()
    await page.goto("https://pt.wikipedia.org/wiki/Ryan_Gosling")

    await page.screenshot({ path: "screenshot.png"})
    await browser.close()
}

captureScreenShot()