const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const fs = require("fs");
const path = require("path");

const Usuario = require("../models/usuario");
const Producto = require("../models/producto");


app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;


    if (Object.keys(req.files).length == 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "No se ha seleccionado ningun archivo"
            }
        })
    }

    //Validar tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.json({
            ok: false,
            err: {
                message: "Los tipos validos son: " + tiposValidos.join(", "),
                tipo
            }
        })
    }

    let archivo = req.files.archivo;

    let nombre = archivo.name.split(".");
    let extencion = nombre[nombre.length - 1];

    // Extenciones permitidas
    let ext = ['png', 'jpg', 'gif', 'jpeg']

    if (ext.indexOf(extencion) < 0) {
        return res.json({
            ok: false,
            err: {
                message: "Extencion no valida, solo se aceptan " + ext.join(", "),
                ext: extencion
            }
        })
    }

    // Cambiando nombre del archivo para que sea unico y prevenir cache del navegador
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extencion}`

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        // La imagen esta carganda 
        if (tipo === 'usuarios')
            imagenUsuario(id, res, nombreArchivo)
        else
            imagenProducto(id, res, nombreArchivo)

        /* res.json({
            ok: true,
            message: "Imagen subida correctamente"
        }) */
    })
})


function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuario) => {
        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuario) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario no existe"
                }
            })
        }


        borraArchivo(usuario.img, 'usuarios')

        usuario.img = nombreArchivo;

        usuario.save((err, usuario) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                usuario,
                img: nombreArchivo
            })
        })
    })
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, producto) => {
        if (err) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!producto) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Producto no existe"
                }
            })
        }


        borraArchivo(producto.img, 'productos')

        producto.img = nombreArchivo;

        producto.save((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                producto,
                img: nombreArchivo
            })
        })
    })
}

function borraArchivo(nombre, tipo) {
    // Verificar la ruta del archivo
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombre}`);

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}


module.exports = app;