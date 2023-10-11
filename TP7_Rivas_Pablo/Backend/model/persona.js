require('rootpath')();

let persona_db = {};

const { query } = require('express'); //conexión con express
const mysql = require('mysql'); //conexión con MySQL
const configuracion = require("config.json");

var connection = mysql.createConnection(configuracion.database);
connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Base de datos conectada.");
    }
});

persona_db.getAll = function (funCallback) { //funcion que realiza el pedido proveniente de persona controller y que le devuelve el error o el resultado
    let consulta = 'SELECT * FROM persona'; //selecciona los elementos de la tabla persona
    connection.query(consulta, function (err, rows) {
        if (err) {
            funCallback(err);
            return;
        } else {
            funCallback(undefined, rows); // Pasa los elementos de la tabla consultada como resultado.
        }
    });
}

persona_db.create = function(persona, funcallback) { //funcion que realiza el pedido proveniente de persona controller y que le devuelve el error o el resultado
    const consulta = "INSERT INTO persona (dni, nombre, apellido) VALUES (?, ?, ?)"; //crea un nuevo elemento en la tabla persona con esas variables
    const params = [persona.dni, persona.nombre, persona.apellido];

    connection.query(consulta, params, (err, resultado) => {
        if (err) {
            funcallback(err);
        } else {
            funcallback(null, resultado.insertId); // Pasa el ID de la nueva persona creada como resultado.
        }
    });
};

persona_db.update = function(persona, funcallback) { //funcion que realiza el pedido proveniente de persona controller y que le devuelve el error o el resultado
    const consulta = "UPDATE persona SET nombre = ?, apellido = ? WHERE dni = ?"; //modifica un nuevo elemento en la tabla persona con esas variables
    const params = [persona.nombre, persona.apellido, persona.dni];

    connection.query(consulta, params, (err, resultado) => {
        if (err) {
            funcallback(err);
        } else {
            funcallback(null, resultado); // Pasar "null" como primer parámetro indica que no hay error. Muestra el valor modificado como resultado.
        }
    });
};

persona_db.delete = function (id_p_e, retorno) { //funcion que realiza el pedido proveniente de persona controller y que le devuelve el error o el resultado
    consulta = "DELETE FROM persona WHERE dni = ?"; //borra un elemento en la tabla persona que coincida con el parámetro dni que se le especifica
    parametro = id_p_e; //id para eliminar (primary key)

    connection.query(consulta, parametro, (err, resultado) => {
        if(err) {
            retorno({message: err.code, detail: err}, undefined);
        }else{
            retorno(undefined, {message: `La persona ${id_p_e} fue eliminada correctamente.`,
            detail: resultado});
        }
    })
};

persona_db.getByApellido = function(apellido, funcallback) { //funcion que realiza el pedido proveniente de persona controller y que le devuelve el error o el resultado
    const consulta = "SELECT apellido FROM persona"; //selecciona un elemento de la columna apellido, de la tabla persona
    const params = apellido;

    connection.query(consulta, params, (err, resultado) => {
        if (err) {
            funcallback(err);
        } else {
            funcallback(null, resultado); // Pasa el resultado de la consulta como información de las personas con el apellido especificado.
        }
    });
};

persona_db.getUserByPersona = function(dni,funcallback) {
    connection.query("SELECT * FROM persona WHERE dni = ?",dni,(err,respuesta) => {
        if (err) {
            funcallback({
                mensaje : "Ha ocurrido algún error, probablemente de sintaxis al buscar la persona.",
                detalle : err
            })
        } else if (respuesta.length == 0) {
            funcallback(undefined, {
                mensaje: "No se encontró la persona buscada.",
                detalle : respuesta
            })
        } else {
            consulta = "SELECT nickname from usuario INNER JOIN persona on usuario.persona = persona.dni and usuario.persona = ?";
            connection.query(consulta,dni,(err,r)=>{
                if (err) {
                    funcallback({
                        mensaje: "Ha ocurrido algún error, posiblemente de sintaxis al buscar el nickname.",
                        detalle: err
                    });
                }else if (r.length == 0) {
                    funcallback(undefined, {
                        mensaje: "La persona seleccionada no posee un usuario registrado en la base de datos.",
                        detalle : r
                    })
                } else {
                    funcallback(undefined, {
                        mensaje: `El nickname de la persona seleccionada es ${r[0]["nickname"]}.`,
                        detalle : r 
                    })
                }
            })
        }
    })
}

module.exports = persona_db;