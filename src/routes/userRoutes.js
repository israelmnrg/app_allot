/**
 * @module routers/userRouter
 */
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/**
 * Ruta para el login
 * @name get/login
 * @function
 * @memberof module:routers/userRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/login', userController.isNotAuthenticated, userController.getLogin);

/**
 * Ruta para el registro
 * @name get/register
 * @function
 * @memberof module:routers/userRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/register', userController.isAuthenticatedAndAdmin, userController.getRegister);

/**
 * Ruta para el registro
 * @name post/register
 * @function
 * @memberof module:routers/userRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/register',userController.isAuthenticatedAndAdmin, userController.register);

/**
 * Ruta para el login
 * @name post/auth
 * @function
 * @memberof module:routers/userRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/auth', userController.login);

/**
 * Ruta para el logout
 * @name post/logout
 * @function
 * @memberof module:routers/userRouter
 * @inner   
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/logout', userController.logout);

/**
 * Ruta para los usuarios
 * @name get/users
 * @function
 * @memberof module:routers/userRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/users', userController.isAuthenticatedAndAdmin, userController.getUsers);

/**
 * Ruta para eliminar usuarios
 * @name post/delete/:id
 * @function
 * @memberof module:routers/userRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/delete/:id', userController.isAuthenticatedAndAdmin, userController.deleteUser);

/**
 * Ruta para editar usuarios
 * @name get/editUser/:id
 * @function
 * @memberof module:routers/userRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/editUser/:id' , userController.isAuthenticatedAndAdmin, userController.editUser);

/**
 * Ruta para actualizar usuarios
 * @name post/update/:id
 * @function
 * @memberof module:routers/userRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/update/:id', userController.isAuthenticatedAndAdmin, userController.update);


module.exports = router;