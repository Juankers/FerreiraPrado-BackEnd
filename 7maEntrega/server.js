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
app.use(function(req, resp) {
    resp.status(404).send({Error: '-2', description: 'No implementado'});
});
app.listen(PORT, () => {
    console.log('Aplicación iniciada en el PORT: ' + PORT);
});