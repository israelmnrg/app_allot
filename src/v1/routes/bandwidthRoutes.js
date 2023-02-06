/**
 * @module routes/bandwidthRoutes
 */
const express = require('express');
const router = express.Router();
const bandwidthController = require('../../controllers/bandwidthController');

/**
 * Ruta para obtener todos los ancho de banda
 * @name post/bandwidth
 * @function
 * @memberof module:routes/bandwidthRoutes
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 * 
 */
router.post('/', bandwidthController.getAllBandwidths);

module.exports = router; 