const express = require('express') // importamos Express
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

//seteamos las env
dotenv.config({path: './env/.env'});

const app = express();
const port = process.env.NODE_ENV == 'test' ? process.env.PORT_TEST : process.env.PORT;
//seteamos urlencoded para capturar los datos del formulario
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// directorio public
app.use(express.static('./src/public'));  

//cookieParser 
app.use(cookieParser());

// seteamos el motor de plantillas
app.set('view engine', 'ejs');
app.set('views', './src/views');

//llamar al router
app.use('/', require('./src/routes/bandwidthRoutes')); 
app.use('/', require('./src/routes/userRoutes'));
app.use('/', require('./src/routes/reportRoutes'));

const server = app.listen(port, () => { 
    console.log(`Listening on port ${port}`);
    }
);

module.exports = {app,server};