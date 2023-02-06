const puppeteer = require('puppeteer');

async function initBrowser() {
    let browser;
    try {
        console.log("abriendo navegador");
        browser = await puppeteer.launch(
            {
                 headless: false //hace que se muestre el navegador 
            });
    } catch (error) {
        console.log("error al abrir el navegador");
    }
    return browser;
}

module.exports = {
    initBrowser
}