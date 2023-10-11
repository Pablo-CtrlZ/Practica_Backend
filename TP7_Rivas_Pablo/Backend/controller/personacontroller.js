require('rootpath')();
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const persona_db = require("model/persona.js");

app.get('/', (req, res) => {
    if (req.query.apellido) {
        console.log('Vamos a buscar por apellido.');
        const apellidoBuscado = req.query.apellido;
        persona_db.getByApellido(apellidoBuscado, (err, resultado) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(resultado);
            }
        });
    } else if (req.query.nickname) {
        console.log('Vamos a buscar por nickname.');
        const nicknameBuscado = req.query.nickname;
        persona_db.getByUser(nicknameBuscado, (err, resultado) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(resultado);
            }
        })
    } else {
        persona_db.getPersona((err, resultado) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(resultado);
            }
        });
    }
})

app.post('/', (req, res) => {
    let crearUnaPersona = req.body;
    persona_db.createPersona(crearUnaPersona, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(resultado);
        }
    })
})

app.put("/persona/:dni", (req, res) => {
    let persona = req.body;
    let id = req.params.dni;
    persona_db.modificarPersona(persona, id, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
})

app.delete('/persona/:dni', (req, res) => {
    let idPersonAEliminar = req.params.dni;
    persona_db.borrar(idPersonAEliminar, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (resultado.detail.affectedRows == 0) {
                res.status(404).send(resultado.message);
            } else {
                res.send(resultado.message);
            }
        }
    });
})

module.exports = app;