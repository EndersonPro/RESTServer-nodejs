/* PUERTO */
process.env.PORT = process.env.PORT || 3000;

/* Entorno */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


/* Vencimiento del token */
process.env.CADUCIDAD_TOKEN = '48h';

/* SEED de autenticacion */
/* Crear una variable en heroku llamada SEED para produccion */
process.env.SEED = process.env.SEED || 'secret';

/* Base de datos */
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

/* CLIENT_ID GOOGLE */
process.env.CLIENT_ID = process.env.CLIENT_ID || '113001961580-kthbr7uarjv1hm1o3vrtvhaa8seditrt.apps.googleusercontent.com';