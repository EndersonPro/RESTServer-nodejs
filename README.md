## RESTServer NodeJS - ExpressJS

Para usarla simplemente clona el proyecto 

```bash
git clone https://github.com/EndersonPro/RESTServer-nodejs.git
```

```bash
cd path/to/clone/RESTServer-nodejs
```

```bash
npm install 
```

Necesitas tener instalado MongoDB en tu sistema operativo, levantar el servicio de mongo con el siguiente comando.

```bash
sudo mongod
```

Dentro del archivo `server/config.js` edita el `<YouNameDatabase>` del bloque de codigo siguiente y si tienes mongo corriendo en otro puerto tambien debes editarlo. 

```javascript
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/<YouNameDatabase>';
} else {
    urlDB = process.env.MONGO_URI;
}
```

Una vez realizada la conexion podras probar la api usando POSTMAN, solo debes importar el archivo `cafe.postman_collection.json` y empezar a probar.. 

Puedes visitar el siguiente enlace [Documentacion API](https://documenter.getpostman.com/view/4649158/RznEKJbU).

> Enderson Vizcaino 