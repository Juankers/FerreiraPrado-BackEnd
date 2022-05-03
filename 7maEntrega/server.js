const express = require('express');
const app = express();
const PORT = 8080;

//Utilizado para los .json
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const productos = require('./src/rutas/rutaProductos');
const carrito = require('./src/rutas/rutaCarrito');

//Routers
app.use('/api/productos', productos);
app.use('/api/carrito'  , carrito);

app.use(function (err, req, resp, next) {
    console.error(err);
    resp.status(500).send('something broke!!');
});

app.listen(PORT, () => {
    console.log('Aplicación iniciada en el PORT: ' + PORT);
})
