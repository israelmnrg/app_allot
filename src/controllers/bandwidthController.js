/**
 * @module controllers/bandwidthController
 * 
*/
const bandwidthService = require('../services/bandwidthService')
const express = require('express');

/**
 * Este método obtiene la información de la tabla de ancho de banda por el id del usuario
 * y la envía a la vista
 * @param {express.Request} req request con el id del usuario
 * @param {express.Response} res response
 * @param {express.NextFunction} next next
 */
const getInfoByUserId = async (req, res, next) => {

    try {
        const allBandwidths = await bandwidthService.getInfoByUserId(req.user.contractId);
        if (allBandwidths.length != 0) {
            req.col1 = allBandwidths[0].period;
            req.col2 = allBandwidths[0].value;
            req.info = allBandwidths;
            req.date = allBandwidths.map((item) => item.date);
            req.megas = allBandwidths.map((item) => item.size);
            req.megas1 = new Array(req.megas.length);
            req.megas2 = new Array(req.megas.length);
            req.megas3 = new Array(req.megas.length);
            for (var i = 0; i < req.megas.length; i++) {
                req.megas1[i] = req.megas[i].split(",")[0].split(" ")[0];
                req.megas2[i] = req.megas[i].split(",")[1].split(" ")[1];
                req.megas3[i] = req.megas[i].split(",")[2].split(" ")[1];
            }

            res.status(200);
            res.render('index', {user: req.user, info: req.info, col1: req.col1, 
                col2: req.col2, date: req.date, size1: req.megas1, size2: req.megas2, size3: req.megas3});
            next();
        } else {  
            req.info = allBandwidths;
            res.render('index', {user: req.user, info: req.info, col1: "" , col2: "", date: "", size1: "", size2: "", size3: ""});
            next();
        }

    } catch (error) {
        res.status(error?.status || 500).send({ status: "FAILED", data: { error: error?.message || error } });
    }
};

module.exports = { getInfoByUserId }