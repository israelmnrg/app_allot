const supertest = require('supertest');
const connection = require('../database/mysql_conector');
const { app, server } = require('../app');
const reportService = require('../src/services/reportService');

const api = supertest(app);

describe('Añadir un reporte no existente con datos correctos', () => {
    test('report', async () => {
        const result = await api.post('/auth')
            .send({ user: 'admin', pass: 'admin' })
            .expect(200);
        const cookie = result.headers['set-cookie'];

        const result2 = await api.post('/addReport')
            .set('Cookie', cookie)
            .send({ url: 'urlDePrueba/clearsee/prueba', contractId: 2 })
            .expect(302);
        expect(result2.text).toContain('Redirecting to /report');
    });
});

describe('Añadir un reporte no existente con contractId no existente', () => {
    test('report', async () => {
        const result = await api.post('/auth')
            .send({ user: 'admin', pass: 'admin' })
            .expect(200);
        const cookie = result.headers['set-cookie'];

        const result2 = await api.post('/addReport')
            .set('Cookie', cookie)
            .send({ url: 'urlDePrueba/clearsee/prueba', contractId: 25 })
            .expect(200);
        expect(result2.text).toContain('el contrato no existe');
    });
});

describe('Eliminat un reporte existente', () => {
    test('report', async () => {
        const result = await api.post('/auth')
        .send({ user: 'admin', pass: 'admin' })
            .expect(200);
        const cookie = result.headers['set-cookie'];
        const report = await reportService.getReportByUrl('urlDePrueba/clearsee/prueba');
        const result2 = await api.post('/deleteReport/' + report[0].id)
            .set('Cookie', cookie)
            .expect(302);
        expect(result2.text).toContain('Redirecting to /report');
    });
});

afterAll(() => {
    connection.end();
    server.close();
})