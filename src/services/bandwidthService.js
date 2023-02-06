
/**
 * @module services/bandwidthService
 */
const connection = require('../../database/mysql_conector');

/**
 * Esta función se encarga de realizar la consulta a la base de datos para obtener la información del anchod de banda según el id del contrato
 * @param {Integer} contractId  contrato del usuario
 * @returns {Promise} la información del ancho de banda
 */
const getInfoByUserId = async(contractId) => {
    return new Promise((resolve, reject) => {
        connection.query('select * from bandwidth b, bandwidth_data d WHERE b.contractId=? and b.id=d.bandwidth_id', [contractId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            } 
        });
    });
   
} 

module.exports = { getInfoByUserId };