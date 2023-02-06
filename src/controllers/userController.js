/**
 * @module controllers/userController
 */
const express = require('express');
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const { promisify } = require('util')
const userService = require('../services/userService')


/**
 * Este método se encarga de registrar un usuario y renderizar la vista register con un mensaje de exito
 * @param {express.Request} req request con los datos del usuario
 * @param {express.Response} res response
 */
const register = async (req, res, next) => {
    const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.SECRET);
    const results = await userService.isAuthenticated(decoded.id);
    if (results[0].rol == "admin") {
        const user = req.body.user;
        const name = req.body.name;
        const rol = req.body.rol;
        const password = req.body.pass;
        const contractId = req.body.contractId;
        const company = req.body.company;
        const repeatPass = req.body.repeatPass;

        if (password != repeatPass) {
            res.render('register', {
                alert: true,
                title: "Error",
                message: "Las contraseñas no coinciden",
                icon: 'error',
                button: true,
                timer: false,
                location: 'register',
                user: results[0]
            })
        } else {
            try {
                const result = await userService.register(user, name, rol, password, contractId, company);
                if (result.status == "FAILED") {
                    res.render('register', {
                        alert: true,
                        title: "Error",
                        message: "El usuario ya existe o el contrato ya esta registrado",
                        icon: 'error',
                        button: true,
                        timer: false,
                        location: 'register'
                    })
                } else {
                    res.setHeader('user', result);
                    res.redirect('/users');
                }
            } catch (error) {
                res.render('register', {
                    alert: true,
                    title: "Error",
                    message: "El usuario ya existe o el contrato ya esta registrado",
                    icon: 'error',
                    button: true,
                    timer: false,
                    location: 'register',
                    user: results[0]
                })
            }
        }
    } else {
        res.redirect('/');
    }

}

/**
 * Este método se encarga de generar un token de inicio de sesión y renderizar la vista principal si el usuario y la contraseña son correctos
 * @param {express.Request} req request con el usuario y la contraseña
 * @param {express.Response} res response
 */
const login = async (req, res, next) => {
    const username = req.body.user;
    const password = req.body.pass;
    try {
        const results = await userService.login(username);
        if (results.status == "FAILED" || !(await bcryptjs.compare(password, results[0].password))) {
            res.status(401);
            res.render('login', {
                alert: true,
                title: "Error",
                message: "Usuario o contraseña incorrecta",
                icon: 'error',
                button: true,
                timer: false,
                location: 'login'
            })
        } else {
            const id = results[0].id;
            const token = jwt.sign({ id: id }, process.env.SECRET, {
                expiresIn: process.env.EXPIRES_IN
            });
            const cookieOptions = {
                expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
                httpOnly: true
            }
            res.cookie('jwt', token, cookieOptions);
            res.body = token;
            res.render('login', {
                alert: true,
                title: "Conexión con éxito",
                message: "Login correcto",
                icon: "success",
                button: false,
                timer: 900,
                location: ''
            })
        }
    } catch (error) {
        res.render('login', {
            alert: true,
            title: "Error",
            message: "Usuario o contraseña incorrecta",
            icon: 'error',
            button: true,
            timer: false,
            location: 'login'
        })
    }
}

/**
 * Este método se encarga de verificar si el usuario esta autenticado y renderizar la vista principal
 * @param {express.Request} req request con las cookies
 * @param {express.Response} res response
 * @param {express.NextFunction} next next
 * @returns {express.NextFunction} next
 */
const isAuthenticated = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.SECRET);
            const results = await userService.isAuthenticated(decoded.id);
            if (!results) {
                return next();
            }
            req.user = results[0];
            return next();
        } catch (error) {
            res.status(error?.status || 500).send({ status: "FAILED", data: { error: error?.message || error } });
        }
    } else {
        res.redirect('/login');
    }
}

/**
 * Este método se encarga de cerrar la sesión, limpia la cookie y redirige a la vista principal
 * @param {express.Request} res response
 */
const logout = async (req, res, next) => {
    res.clearCookie('jwt');
    res.redirect('/');
}

/**
 * Este método se encarga de verificar si el usuario esta autenticado y es administrador y renderizar la vista principal
 * @param {express.Request} req request con las cookies
 * @param {express.Response} res response
 * @param {express.NextFunction} next next
 * @returns {express.NextFunction} next
 */
const isAuthenticatedAndAdmin = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.SECRET);
            const results = await userService.isAuthenticated(decoded.id);
            if (!results) {
                return next();
            }
            req.user = results[0];
            if (req.user.rol == 'admin') {
                return next();
            } else {
                res.redirect('/');
            }
        } catch (error) {
            res.status(error?.status || 500).send({ status: "FAILED", data: { error: error?.message || error } });
        }
    } else {
        res.redirect('/login');
    }
}

/**
 * Este método se encarga de verificar si el usuario no esta autenticado y renderizar la vista principal
 * @param {express.Request} req request con las cookies
 * @param {express.Response} res response
 * @param {express.NextFunction} next next
 * @returns {express.NextFunction} next
 */
const isNotAuthenticated = async (req, res, next) => {
    if (req.cookies.jwt) {
        res.redirect('/');
    } else {
        return next();
    }
}

/**
 * Este método se encarga de obtener todos los usuarios y renderizar la vista de usuarios
 * @param {express.Request} req request
 * @param {express.Response} res response
 * @param {express.NextFunction} next
 * @returns {express.NextFunction} next
 */
const getUsers = async (req, res, next) => {
    try {
        const results = await userService.getUsers();
        if (results.status == "FAILED") {
            res.status(401);
        } else {
            req.users = results;
            res.render('users', { user: req.user, users: req.users, body: req.users, alert: false });;
            next();
        }
    } catch (error) {
        res.status(error?.status || 500).send({ status: "FAILED", data: { error: error?.message || error } });
    }
}

/**
 * Este método se encarga de borrar un usuario y renderizar la vista de usuarios
 * @param {express.Request} req request con el id del usuario
 * @param {express.Response} res response
 */
const deleteUser = async (req, res, next) => {
    const { id } = req.params;
    try {
        const result = await userService.deleteUser(id);
        if (result.status == "FAILED") {
            res.status(401);
        } else {
            res.redirect('/users');
        }
    } catch (error) {
        res.status(error?.status || 500).send({ status: "FAILED", data: { error: error?.message || error } });
    }
}

/**
 * Este método se encarga de renderizar la vista de editar usuario y obtener los datos del usuario
 * @param {express.Request} req request con el id del usuario
 * @param {express.Response} res response
 * 
 */
const editUser = async (req, res, next) => {
    const { id } = req.params;
    const result = await userService.editUser(id);
    if (result.status == "FAILED") {
        res.status(401);
    } else {
        res.render('editUser', { id: req.params, user: req.user, userEdit: result[0], alert: false });
    }
}

/**
 * Este método se encarga de actualizar los datos del usuario y renderizar la vista de usuarios
 * @param {express.Request} req request con los datos del usuario
 * @param {express.Response} res response
 * 
 */
const update = async (req, res, next) => {
    const { id } = req.params;
    const userEdit = await userService.editUser(id);
    const user = req.body.user;
    const name = req.body.name;
    const rol = req.body.rol;
    const contractId = req.body.contractId;
    const company = req.body.company;

    try {
        const result = await userService.update(user, name, rol, contractId, company, req.params.id);
        if (result.status == "FAILED") {
            res.render('editUser', {
                alert: true,
                title: "Error",
                message: "El usuario ya existe o el contrato ya esta registrado",
                icon: 'error',
                button: true,
                timer: false,
                location: 'editUser/' + req.params.id,
                user: req.body.user,
                userEdit: userEdit
            })
        } else {
            res.redirect('/users');
        }
    } catch (error) {
        res.render('editUser', {
            alert: true,
            title: "Error",
            message: "El usuario ya existe o el contrato ya esta registrado",
            icon: 'error',
            button: true,
            timer: false,
            location: 'editUser/' + req.params.id,
            user: req.body.user,
            userEdit: userEdit
        })
    }
}

/**
 * Este método se encarga de renderizar la vista de login
 * 
 * @param {express.Response} res response
 */
const getLogin = (req, res, next) => {
    res.render('login', { alert: false });
}

/**
 * Este método se encarga de renderizar la vista de registro
 * @param {express.Response} res response
 */
const getRegister = (req, res, next) => {
    res.render('register', { user: req.user, alert: false });
}

module.exports = { getLogin, getRegister, isNotAuthenticated, isAuthenticated, isAuthenticatedAndAdmin, getUsers, deleteUser, editUser, update, logout, login, register, isNotAuthenticated }   