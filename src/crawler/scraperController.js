/**
 * @module crawler
 */
const { Browser } = require('puppeteer');
const pageScraper = require('./scraperService.js');

/**
 * Método que se encarga de hacer el crawler de las paginas que queremos
 * @param {Browser} browserInstance navegador
 * @param {String} urls urls de las paginas que queremos hacer el crawler
 * @param {String} endpoint endpoint de la api
 * @param {String} user usuario de la api
 * @param {String} password contraseña del usuario
 */
async function scrapeAll(browserInstance, urls, endpoint, user, password) {
    let browser;
    let extractedData = [];

    try {
        browser = await browserInstance;

        // Extraer datos de la página
        extractedData = await pageScraper.scraper(browser, urls, endpoint, user, password);
        await browser.close();  //cerramos el navegador
        console.log("navegador cerrado");

        return extractedData;
    }
    catch (err) {
        await browser.close();
        console.log("No se ha podido resolver el navegador => ", err);
    }
}

module.exports = {
    scrapeAll
};