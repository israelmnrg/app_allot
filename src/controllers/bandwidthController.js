/**
 * @module controllers/bandwidthController
 */
const bandwidthService = require('../services/bandwidthService');
const express = require('express');
/**
 * Método para obtener todos los ancho de banda
 * @param {express.Request} req request con la información de las urls, el endpoint, el usuario y la contraseña
 * @param {express.Response} res response
 */
async function getAllBandwidths (req, res) {
    const { body } = req;

    const urls = body.urls;
    const endpoint = body.endpoint;
    const user = body.user;
    const password = body.password;
    const bandwidths = await bandwidthService.getAllBandwidths(urls, endpoint, user, password);
    if(bandwidths==undefined){
        setTimeout(() => {
        }, 60000);
    }else{
    console.log(bandwidths);
    res.status(201).send( bandwidths );
    }
};

module.exports = {
    getAllBandwidths
};

