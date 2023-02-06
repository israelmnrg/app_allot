/**
 * @module controllers/reportController
 */
const express = require('express');
const reportService = require('../services/reportService');
const userService = require('../services/userService');

/**
 * Este metodo se encarga de obtener los reportes de ancho de banda y renderizar la vista report con los datos obtenidos 
 * @param {express.Request} req request con los datos del usuario
 * @param {express.Response} res response con los datos de los reportes
 */
const getBandwidthReport = async (req, res, next)  => {
    try{
    const reports = await reportService.getBandwidthReport();
        if (reports.status == "FAILED") {
            console.log(error);
        } else {
            res.render('report', {user: req.user, reports: reports});
        }
    } catch (error) {
        res.status(error?.status || 500).send({ status: "FAILED", data: { error: error?.message || error } });
    }
}

/**
 * Este metodo se encarga agregar un reporte de ancho de banda si el contrato existe y renderizar la vista addBandwidth con un mensaje de exito
 * @param {express.Request} req request con los datos del usuario
 * @param {express.Response} res response con los datos de los reportes
 */
const addBandwidthReport = async (req, res, next)  => {
    const url = req.body.url;
    const contractId = req.body.contractId;
    try {
        
        const results  = await userService.getUserByContractId(contractId);
            if (results.length == 0) {
                res.render('addReport', {
                    alert: true,
                    title: "Error",
                    message: "el contrato no existe",
                    icon: 'error',
                    button: true,
                    timer: false,
                    user: req.user
                })
            } else {
                const add = await reportService.addBandwidthReport(url, contractId, results[0].company, results[0].name);
                    if (add.status=="FAILED") {
                        console.log(error);
                    } else {
                        res.redirect('/report');
                    }
            }
    } catch (error) {
        res.render('addReport', {
            alert: true,
            title: "Error",
            message: "el contrato no existe o url repetida",
            icon: 'error',
            button: true,
            timer: false,
            user: req.user
        })
    }
}

/**
 * Este metodo se encarga de renderizar la vista addReport
 * @param {express.Request} req request con los datos del usuario
 * @param {express.Response} res response con los datos de los reportes
 */
const getReports = (req, res, next)  => {
    res.render('addReport', {user: req.user, alert: false});
}

/**
 * Este metodo se encarga de eliminar un reporte de ancho de banda y renderizar la vista report con los datos obtenidos
 * @param {expres.Request} req request con el id del reporte a eliminar
 * @param {express.Response} res response con los datos de los reportes
 * @param {express.Next} next next
 */
const deleteReport = async (req, res, next) => {
    const id = req.params.id;
    try {
        const deleteReport = await reportService.deleteReport(id);
        if (deleteReport.status == "FAILED") {
            console.log(error);
        } else {
            res.redirect('/report');
        }
    } catch (error) {
        res.status(error?.status || 500).send({ status: "FAILED", data: { error: error?.message || error } });
    }
}

module.exports = { getBandwidthReport, addBandwidthReport , getReports , deleteReport};