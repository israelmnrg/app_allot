
const browser = require('./browser');
const scraperController = require('./scraperController');


/**
 * Método para obtener todos los ancho de banda
 * @param {String} urls urls de las paginas que queremos hacer el crawler
 * @param {String} endpoint endpoint de la api
 * @param {String} user usuario de la api
 * @param {String} password contraseña del usuario
 * @returns {Promise} lista de ancho de banda
 */
const getAllBandwidths = async (urls, endpoint, user, password) => {
    let initBrowser = browser.initBrowser();
    let temp =  await scraperController.scrapeAll(initBrowser, urls, endpoint, user, password);
    return temp;
};

module.exports = {
    getAllBandwidths
};