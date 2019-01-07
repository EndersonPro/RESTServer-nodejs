const express = require("express");
const { verificarToken } = require("../middlewares/autenticacion");

let app = express();
let Producto = require("../models/producto");


// ============================
// Mostrar todas los productos
// ============================
app.get("/productos", verificarToken, (req, res) => {
    /* Trae todos los usuarios */
    /* Pupulate usuarios y categoria */
    /* Paginado */
    let desde = Number(req.query.desde) || 0;

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos
            })
        })
});

// ============================
// Mostrar producto por id
// ============================
app.get("/productos/:id", verificarToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            if (!producto) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "ID no existe"
                    }
                })
            }
            res.json({
                ok: true,
                producto
            })
        })
});

// ============================
// Buscar producto por termino
// ============================
app.get("/productos/buscar/:termino", verificarToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                productos
            })
        })
})

// ============================
// Crear nuevo producto
// ============================
app.post("/productos", verificarToken, (req, res) => {
    //grabar usuario
    // grabar categoria
    let body = req.body;
    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    })
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.status(201).json({
            ok: true,
            productoDB
        })
    })
});

// ============================
// Actualizar producto
// ============================
app.put("/productos/:id", verificarToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "El id no existe"
                }
            })
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                producto
            })
        })

    })
});

// ============================
// Borrar producto
// ============================
app.delete("/productos/:id", verificarToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id, (err, producto) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!producto) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "El id no existe"
                }
            })
        }

        producto.disponible = false;

        producto.save((err, produtoBorado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                producto: produtoBorado,
                message: "Producto Borrado"
            })
        })
    })
});


module.exports = app;