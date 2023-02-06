const supertest = require('supertest');
const connection = require('../database/mysql_conector');
const { app, server } = require('../app');

const api = supertest(app);
const userService = require('../src/services/userService');


describe('Test de autenticación, contraseña incorrecta', () => {
    test('login', async () => {
        const result = await api.post('/auth')
            .send({ user: 'admin', pass: 'admi' })
            .expect(401);

        //que no tenga la propiedad set-cookie
        expect(result.headers['set-cookie']).toBeUndefined();
    });
});

describe('Test de autenticación, username incorrecta', () => {
    test('login', async () => {
        const result = await api.post('/auth')
            .send({ user: 'adminFalso', pass: 'admin' })
            .expect(200);

        //que no tenga la propiedad set-cookie
        expect(result.headers['set-cookie']).toBeUndefined();
    });
});

describe('Test de autenticación, username vacio', () => {
    test('login', async () => {
        const result = await api.post('/auth')
            .send({ user: '', pass: 'admin' })
            .expect(200);

        //que no tenga la propiedad set-cookie
        expect(result.headers['set-cookie']).toBeUndefined();
    });
});

describe('Test de autenticación, contraseña vacio', () => {
    test('login', async () => {
        const result = await api.post('/auth')
            .send({ user: 'admin', pass: '' })
            .expect(401);

        //que no tenga la propiedad set-cookie
        expect(result.headers['set-cookie']).toBeUndefined();
    });
});


describe('Test de autenticación user, contraseña correcta y usuario', () => {
    test('login', async () => {
        const result = await api.post('/auth')
            .send({ user: 'israel', pass: '1234' })
            .expect(200);

        //que no tenga la propiedad set-cookie
        expect(result.headers).toHaveProperty('set-cookie');
        console.log(result.headers);

    });
});

describe('Test de autenticación admin. ver inicio', () => {
    test('login', async () => {
        const result = await api.post('/auth')
            .send({ user: 'admin', pass: 'admin' })
            .expect(200);

        //que no tenga la propiedad set-cookie
        expect(result.headers).toHaveProperty('set-cookie');
        expect(result.text).toContain('Login correcto');

        const result2 = await api.get('/')
            .set('Cookie', result.headers['set-cookie'])
            .expect(200)
        expect(result2.text).toContain('Inicio');
        await api.get('/logout');
    });
});

describe('Ver listado de usuarios', () => {
    test('login', async () => {
        const result = await api.post('/auth')
            .send({ user: 'admin', pass: 'admin' })
            .expect(200);

        //que no tenga la propiedad set-cookie
        const cookie = result.headers['set-cookie'];
        const result2 = await api.get('/users').
            set('Cookie', cookie)
        expect(result2.text).toContain('Lista de usuarios');
        await api.get('/logout');
    });
});


describe('Test de registro de usuarios autenticado como admin usuario que no existe', () => {
    test('register', async () => {

        const resul2 = await api.post('/auth')
            .send({ user: 'admin', pass: 'admin' })
        const cookie = resul2.headers['set-cookie'];

        const result = await api.post('/register')
            .set('Cookie', cookie)
            .send({ user: 'test', name: 'test', rol: 'user', pass: 'test', repeatPass: 'test', contractId: '11', company: 'test' })
            .expect(302);
        expect(result.text).toContain('Redirecting to /users');
    });
});

describe('Test de registro de usuarios autenticado como admin usuario que ya existe', () => {
    test('register', async () => {

        const resul2 = await api.post('/auth')
            .send({ user: 'admin', pass: 'admin' })
        const cookie = resul2.headers['set-cookie'];

        const result = await api.post('/register')
            .set('Cookie', cookie)
            .send({ user: 'test', name: 'test', rol: 'user', pass: 'test', repeatPass: 'test', contractId: '11', company: 'test' })
            .expect(200);
        expect(result.text).toContain('El usuario ya existe o el contrato ya esta registrado');
    });
});

describe('Test de registro de usuarios autenticado como admin contractId que ya existe', () => {
    test('register', async () => {

        const resul2 = await api.post('/auth')
            .send({ user: 'admin', pass: 'admin' })
        const cookie = resul2.headers['set-cookie'];

        const result = await api.post('/register')
            .set('Cookie', cookie)
            .send({ user: 'test2', name: 'test2', rol: 'user', pass: 'test', repeatPass: 'test', contractId: '11', company: 'test' })
            .expect(200);
        expect(result.text).toContain('El usuario ya existe o el contrato ya esta registrado');
    });
});

describe('Test de registro de usuarios autenticado como user', () => {
    test('register', async () => {
        const resul2 = await api.post('/auth')
            .send({ user: 'test', pass: 'test' })
        const cookie = resul2.headers['set-cookie'];
        const result = await api.post('/register')
            .set('Cookie', cookie)
            .send({ user: 'test1', name: 'test1', rol: 'user', pass: 'test', repeatPass: 'test', contractId: '12', company: 'test' })
            .expect(302);
        expect(result.text).toContain('Redirecting to /');
    });
});


describe('Test de eliminar usuario identificado como user', () => {
    test('delete', async () => {
        const resul2 = await api.post('/auth')
            .send({ user: 'israel', pass: '1234' })
        const cookie = resul2.headers['set-cookie'];
        const result = await api.post('/delete/' + 2)
            .set('Cookie', cookie)
            .expect(302);
        console.log(result.text);
        expect(result.text).toContain('Redirecting to /');
    });
});

describe('Editar un usuario con datos válidos', () => {
    test('edit', async () => {
        const resul2 = await api.post('/auth')
            .send({ user: 'admin', pass: 'admin' })
        const cookie = resul2.headers['set-cookie'];
        const userToDelete = await userService.getUserByContractId(11);
        const result = await api.post('/update/' + userToDelete[0].id)
            .set('Cookie', cookie)
            .send({user: 'testUpdated', name: 'testUpdated', rol: 'user', contractId: '11', company: 'testUpdated' })
            .expect(302);
        console.log(result.text);
        expect(result.text).toContain('Redirecting to /users');
    });
});

describe('Editar un usuario con un contractId ya existente', () => {
    test('edit', async () => {
        const resul2 = await api.post('/auth')
            .send({ user: 'admin', pass: 'admin' })
        const cookie = resul2.headers['set-cookie'];
        const userToDelete = await userService.getUserByContractId(11);
        const result = await api.post('/update/' + userToDelete[0].id)
            .set('Cookie', cookie)
            .send({user: 'testUpdated', name: 'testUpdated', rol: 'user', contractId: '2', company: 'testUpdated' })
            .expect(200);
        expect(result.text).toContain('El usuario ya existe o el contrato ya esta registrado');
    });
});

describe('Editar un usuario con un username ya existente', () => {
    test('edit', async () => {
        const resul2 = await api.post('/auth')
            .send({ user: 'admin', pass: 'admin' })
        const cookie = resul2.headers['set-cookie'];
        const userToDelete = await userService.getUserByContractId(11);
        const result = await api.post('/update/' + userToDelete[0].id)
            .set('Cookie', cookie)
            .send({user: 'admin', name: 'testUpdated', rol: 'user', contractId: '11', company: 'testUpdated' })
            .expect(200);
        expect(result.text).toContain('El usuario ya existe o el contrato ya esta registrado');
    });
});


describe('Test de eliminar usuario identificado como admin', () => {
    test('delete', async () => {
        const resul2 = await api.post('/auth')
            .send({ user: 'admin', pass: 'admin' })
        const cookie = resul2.headers['set-cookie'];
        console.log("COOKIE:" +  cookie);
        const userToDelete = await userService.getUserByContractId(11);
        const result = await api.post('/delete/' + userToDelete[0].id)
            .set('Cookie', cookie)
            .expect(302);
        console.log(result.text);
        expect(result.text).toContain('Redirecting to /users');
    });
});

afterAll(() => {
    connection.end();
    server.close();
})