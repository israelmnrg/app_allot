/**
 * @module services/userService
 */
const bcryptjs = require('bcryptjs')
const connection = require('../../database/mysql_conector')


/**
 * Esta función se encarga de insertar un usuario en la base de datos
 * @param {String} user username del usuario 
 * @param {String} name nombre del usuario 
 * @param {String} rol rol del usuario 
 * @param {String} password contraseña del usuario 
 * @param {Integer} contractId contrato del usuario 
 * @param {String} company empresa del usuario 
 * @returns {Promise} el usuario insertado
 */
const register = async (user, name, rol, password, contractId, company) => {
    let passwordHash = await bcryptjs.hash(password, 8);
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO user SET ?', { username: user, name: name, rol: rol, password: passwordHash, contractId: contractId, company: company }, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

/**
 * Esta función se encarga de realizar la consulta a la base de datos para obtener el usuario según el username
 * @param {String} username username del usuario  
 * @returns {Promise} el usuario
 */
const login = async (username) => {
    return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM user WHERE username = ?', [username], async (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
    });
}


/**
 * Esta función se encarga de realizar la consulta a la base de datos para obtener el usuario según el id
 * @param {Integer} decodedId id del usuario 
 * @returns {Promise} el usuario
 */
const isAuthenticated = async (decodedId) => {	
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM user WHERE id = ?', [decodedId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

/**
 * Esta función se encarga de realizar la consulta a la base de datos para obtener todos los usuarios
 * @returns {Promise} todos los usuarios
 */
const getUsers = async () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM user', (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

/**
 * Esta función se encarga de realizar la consulta a la base de datos para eliminar un usuario
 * @param {Integer} id del usuario
 * @returns {Promise} el usuario
 */
const deleteUser = async (id) => {
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM user WHERE id = ?', [id], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

/**
 * Esta función se encarga de realizar la consulta a la base de datos para obtener un usuario
 * @param {Integer} id id del usuario
 * @returns {Promise} el usuario
 */
const editUser = async (id) => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM user WHERE id = ?', [id], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

/**
 * Esta función se encarga de realizar la consulta a la base de datos para actualizar un usuario según el id
 * @param {String} user username del usuario
 * @param {String} name nombre del usuario
 * @param {String} rol rol del usuario 
 * @param {Integer} contractId contractId del usuario 
 * @param {String} company empresa del usuario
 * @param {Integer} id id del usuario 
 * @returns {Promise} el usuario actualizado
 */
const update = async (user, name, rol, contractId, company, id) => {
    return new Promise((resolve, reject) => {
        connection.query('UPDATE user SET username = ?, name = ?, rol = ?, contractId = ?, company = ? WHERE id = ?', [user, name, rol, contractId, company, id], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

/**
 * Esta función se encarga de realizar la consulta a la base de datos para obtener un usuario según el contractId
 * @param {Integer} contractId contractId del usuario
 * @returns {Promise} el usuario
 */
const getUserByContractId = async (contractId) => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM user WHERE contractId = ?', [contractId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}


module.exports = { register , login, isAuthenticated, getUsers, deleteUser, editUser, update, getUserByContractId};