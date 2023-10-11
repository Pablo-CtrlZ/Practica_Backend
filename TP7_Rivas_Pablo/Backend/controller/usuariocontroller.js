require('rootpath')();
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const usuario_db = require("model/usuario")

app.get('/', (req, res) => {
    if (req.query.mail) {
        console.log('Vamos a buscar por mail.');
        const mailBuscado = req.query.mail;
        usuario_db.getByMail(mailBuscado, (err, resultado) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(resultado);
            }
        });
    } else {
        usuario_db.getUsuario((err, resultado) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(resultado);
            }
        });
    }
})

app.post('/', (req, res) => {
    let crearUsuario = req.body;
    usuario_db.createUsuario(crearUsuario, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(resultado);
        }
    })
})

app.put('/:mail', (req, res) => {
    let usuario = req.body;
    let id = req.params.mail;
    usuario_db.modificarUsuario(usuario, id, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
})

app.delete('/:mail', (req, res) => {
    let idUsuarioAEliminar = req.params.mail;
    usuario_db.borrar(idUsuarioAEliminar, (err, resultado) => {
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