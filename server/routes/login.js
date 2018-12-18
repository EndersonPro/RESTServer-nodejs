const express = require("express");
const bycryt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require("../models/usuario");
const app = express();


app.post('/login', (req, res) => {
    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                err: '(Usuario) o contraseña incorrectos'
            })
        }

        /* bycryt.compareSync() Es una funcion que me returna un true si los paremetros hacen match */
        // bycryt.compareSync(contraseña_del_login, contraseña_bdd)
        if (!bycryt.compareSync(body.password, usuario.password)) {
            return res.status(400).json({
                ok: false,
                err: 'Usuario o (contraseña) incorrectos'
            })
        }

        let token = jwt.sign({
            usuario
        }, process.env.SEED, {
                expiresIn: process.env.CADUCIDAD_TOKEN
            })

        res.json({
            ok: true,
            usuario,
            token
        })
    })
})


async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}


app.post('/google', async (req, res) => {
    let token = req.body.idtoken;

    let googleUser = await verify(token).catch(err => {
        return res.status(403).json({
            ok: false,
            err
        })
    })
    /* Verificar si el usuario loggeado con Google no tenga el correo ya registrado */
    Usuario.findOne({ email: googleUser.email }, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (usuario) {
            if (usuario.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Debe usar autenticacion normal"
                    }
                })
            } else {
                let token = jwt.sign({
                    usuario
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })

                return res.json({
                    ok: true,
                    usuario,
                    token
                })
            }
        } else {
            /* Si el usuario no existe en nuestra base de datos */

            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ":)";

            usuario.save((err, usuario) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }
                let token = jwt.sign({
                    usuario
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })

                return res.json({
                    ok: true,
                    usuario,
                    token
                })

            })
        }
    })

    /* res.json({
        googleUser
    }) */
})

module.exports = app;