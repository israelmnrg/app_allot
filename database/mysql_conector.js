const mysql = require('mysql2');

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_DATABASE = process.env.DB_DATABASE;
const DB_PORT = process.env.DB_PORT;    



const connection = process.env.NODE_ENV == 'test' ? mysql.createConnection({   
    host : 'localhost',
    user : 'admin',
    password : 'admin',
    database : 'test2',
    port : '3306'
}) : mysql.createConnection({
    host : process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
});


connection.connect((err) => { 
    if (err) {
        console.log("esta fallando")
        console.log(err); 
        return;
    }
    console.log('Conectado a la base de datos');
})

module.exports = connection;

