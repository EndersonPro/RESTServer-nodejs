const express = require("express");
const { verificaToken } = require("../middlewares/autenticacion");

let app = express();
let producto = require("../models/producto");


// ============================
// Mostrar todas los productos
// ============================
app.get("/productos", (req, res) => {
    /* Trae todos los usuarios */
    /* Pupulate usuarios y categoria */
    /* Paginado */
});

// ============================
// Mostrar producto por id
// ============================
app.get("/producto/:id", (req, res) => {

});

// ============================
// Crear nuevo producto
// ============================
app.post("/productos", (req, res)=>{
    //grabar usuario
    // grabar categoria
});

// ============================
// Actualizar producto
// ============================
app.put("/producto/:id", (req, res) => {

});

// ============================
// Borrar producto
// ============================
app.delete("/producto/:id", (req, res) => {
    
});


module.exports = app;