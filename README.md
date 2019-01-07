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

Necesitas tener instalado MongoDB en tu sistema operativo, levantar el servicio de mongo con el siguiente comando Linux y Mac para windows es diferente, revisa la documentacion de MongoDB.

```bash
sudo mongod
```

#### Importante

Debes declarar dos variables de entorno en produccion:

- `MONGO_URI`
- `HOST`

Como el proyecto se desplego en heroku se hizo de la siguente manera.

```bash
heroku config:set MONGO_URI="<YourURLDatabase>" --app <YourNameApp>
```

```bash
heroku config:set HOST=0.0.0.0 --app <YourNameApp>
```

Con eso sera sufiente para que funcione.

Puedes revisar el proceso en heroku usando el siguiente comando:

```bash
heroku logs --tail
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
