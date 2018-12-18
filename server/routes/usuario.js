const express = require("express");
const bycryt = require("bcrypt");

const _ = require('lodash');
const Usuario = require("../models/usuario");
const { verificarToken, verificaAdmin_Role } = require("../middlewares/autenticacion")

const app = express();

app.get('/usuario', verificarToken, (req, res) => {

    /* /usuario?since=5&limit=5 */
    let since = Number(req.query.since) || 0;
    let limit = Number(req.query.limit) || 5;

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(since)
        .limit(limit)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            /* cuenta cuantos registros tengo en la coleccion */
            Usuario.count({ estado: true }, (err, count) => {
                res.json({
                    ok: true,
                    usuarios,
                    count
                })
            })
        })
})

app.post('/usuario', [verificarToken, verificaAdmin_Role], (req, res) => {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bycryt.hashSync(body.password, 10),
        /* img:body.img */
        role: body.role
    })

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })

})

app.put('/usuario/:id', [verificarToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    /* Usando Lodash para filtrar el objeto y solo optener los elementos del array  */
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    let opts = {
        /* Me retorna el nuevo usuario actualizado */
        new: true,
        /* Para correr todas las validaciones definidas en el schema */
        runValidators: true
    }

    Usuario.findByIdAndUpdate(id, body, opts, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
})

app.delete('/usuario/:id', [verificarToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: 'Usuario no existe'
            })
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    })
})

module.exports = app;