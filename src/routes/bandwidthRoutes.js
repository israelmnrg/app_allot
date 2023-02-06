/**
 * @module routers/bandwidthRouter
 */
const express = require('express');
const router = express.Router();
const bandwidthController = require('../controllers/bandwidthController');
const userController = require('../controllers/userController');

/**
 * Ruta para el home
 * @name get/
 * @function
 * @memberof module:routers/bandwidthRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/', userController.isAuthenticated, bandwidthController.getInfoByUserId);

module.exports = router;