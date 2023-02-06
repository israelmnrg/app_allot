/**
 * @module routers/reportRouter
 */
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const reportController = require('../controllers/reportController');

/**
 * Ruta para el reporte
 * @name get/report
 * @function
 * @memberof module:routers/reportRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/report', userController.isAuthenticatedAndAdmin, reportController.getBandwidthReport);

/**
 * Ruta para la vista de agregar reporte
 * @name get/addReport
 * @function
 * @memberof module:routers/reportRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/addReport', userController.isAuthenticatedAndAdmin, reportController.getReports);

/**
 * Ruta para agregar reporte
 * @name post/addReport
 * @function
 * @memberof module:routers/reportRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/addReport', userController.isAuthenticatedAndAdmin, reportController.addBandwidthReport);

/**
 * Ruta para eliminar reporte
 * @name post/deleteReport
 * @function
 * @memberof module:routers/reportRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/deleteReport/:id', userController.isAuthenticatedAndAdmin, reportController.deleteReport);

module.exports = router;