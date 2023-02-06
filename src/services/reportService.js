/**
 * @module services/reportService
 */
const connection = require('../../database/mysql_conector');


/**
 * Esta función se encarga de realizar la consulta a la base de datos para obtener todos los reportes de ancho de banda
 * @returns {Promise} todos los reportes de ancho de banda
 */
const getBandwidthReport = async () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM report', (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}


/**
 * Esta función se encarga de realizar la consulta a la base de datos para agregar un reporte de ancho de banda
 * @param {String} url url del reporte
 * @param {Integer} contractId  contrato del usuario
 * @param {String} company empresa del usuario
 * @param {String} name nombre del usuario
 * @returns {Promise} el reporte de ancho de banda
 */
const addBandwidthReport = async (url, contractId, company, name) => {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO report SET ?', { url: url, contractId: contractId, company: company, name: name }, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

/**
 * Esta función se encarga de realizar la consulta a la base de datos para eliminar un reporte de ancho de banda
 * @param {Integer} id 
 * @returns {Promise} el reporte de ancho de banda
 */
const deleteReport = async (id) => {
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM report WHERE id = ?', [id], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

const getReportByUrl = async (url) => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM report WHERE url = ?', [url], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}


module.exports = { getBandwidthReport, addBandwidthReport , deleteReport, getReportByUrl};