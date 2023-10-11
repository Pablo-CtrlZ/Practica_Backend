require('rootpath')(); //requerimos rootpath mediante el método require
const express = require('express'); //definimos una constante llamada express, la cual llama al módulo express mediante el método require
const morgan = require('morgan'); //definimos una constante llamada morgan, la cual llama al módulo morgan mediante el método require
const app = express(); //definimos una constante llamada app, la cual redefine la constante express
app.use(express.json()); //permitimos a express que utilice el formato JSON
app.use(express.urlencoded({ extended: true })); //permitimos que express utilice URLs
app.use(morgan('tiny')); //permitimos que express use morgan
morgan(':method :url :status :res[content-length] - :response-time ms'); //configuración de morgan
const configuracion = require("configuracion.json"); //define una constante llamada configuración, que mediante el método require, solicita los datos del archivo configuración.json
const controladorPersona = require("controller/personaController.js"); // define una constante llamada controladorPersona que requiere al archivo personaController.js
const controladorUsuario = require("controller/usuarioController.js"); //define una constante llamada constroladorUsuario que requiere al archivo usuarioController.js
app.use('/api/persona', controladorPersona); // vamos a definir un endpoint (api/persona), para probar el CRUD en la tabla persona de mi DB
app.use('/api/usuario', controladorUsuario); // vamos a definir un endpoint (api/usuario), para probar el CRUD en la tabla usuario de mi DB
app.listen(configuracion.server.port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("servidor escuchando en el puerto " + configuracion.server.port);
    }
});