require("./config/config");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();

mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, res) => {
    if (err) throw err;
    console.log('base de datos conectada');
})


/* Middlewares */
app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use(require("./routes/index"));
app.use(express.static(path.resolve(__dirname,'../public')))



app.listen(process.env.PORT, () => {
    console.log("escuchando el puerto", process.env.PORT);
})