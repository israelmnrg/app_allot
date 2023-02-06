
const Bandwith = require('../crawler/Bandwidth');

/**
 * Metodo para obtener todos los ancho de banda
 * @param {String} urls urls de las paginas que queremos hacer el crawler
 * @param {String} endpoint endpoint de la api
 * @param {String} user usuario de la api
 * @param {String} password contraseña del usuario
 * @returns {Promise} lista de ancho de banda
 */
const getAllBandwidths = async (urls, endpoint, user, password) => {
    const allBandwith = await Bandwith.getAllBandwidths(urls, endpoint, user, password);
    return allBandwith;
}

module.exports = {
    getAllBandwidths
};