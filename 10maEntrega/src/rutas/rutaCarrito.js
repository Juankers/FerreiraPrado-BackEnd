const express    = require('express');
const { Router } = express;
const carrito    = Router();


const { CarritoDaoArchivo   } = require('../daos/Carrito/CarritoDaoArchivo');
const { ProductoDaoArchivo } = require('../daos/Productos/ProductoDaoArchivo');
let CarritoDao      = new CarritoDaoArchivo();
let ProductosDao    = new ProductoDaoArchivo();


// const { Carrito   } = require('../daos/Carrito/CarritoDaoFirebase');
// const { Productos } = require('../daos/Productos/ProductoDaoFirebase');
// let CarritoDao      = new Carrito();
// let ProductosDao    = new Productos();


// const { Carrito   } = require('../daos/Carrito/CarritoDaoMongo');
// const { Productos } = require('../daos/Productos/ProductoDaoMongo');
// let CarritoDao      = new Carrito();
// let ProductosDao    = new Productos();


//Carrito
//POST nuevo
carrito.post('/', (req, resp) => {
    resp.send(CarritoDao.new());
})
//POST productos en carrito
carrito.post('/:id/productos', (req, resp) => {
    let id      = req.params.id;
    let carrito = CarritoDao.getById(id);
    if(carrito){
        // let productoNuevo = req.body;
        let productoNuevo = ProductosDao.getRand();
        resp.send(CarritoDao.add_product(id, productoNuevo));
    } else resp.send({Error: `No hay ningun carrito con id:${id}`}) 
})
//DELETE carrito
carrito.delete('/:id', (req, resp) => {
    let id      = req.params.id;
    let carrito = CarritoDao.getById(id);
    if(carrito){
    resp.send(CarritoDao.deleteById(id));
    } else resp.send({Error: `No hay ningun carrito con id:${id}`}) 
})
//DELETE producto en carrito
carrito.delete('/:id/productos/:id_prod', (req, resp) => {
    let id_cart  = req.params.id;
    let id_prod  = req.params.id_prod;
    let carrito  = CarritoDao.getById(id_cart)
    if(carrito){
        let producto = cart.get_product_in_cart(id_cart,id_prod)
        if(producto){
            resp.send(CarritoDao.delete_Product(id_cart,id_prod));
        } else resp.send({Error: `No hay ningun producto con id:${id_prod} en el carrito`})
    } else resp.send({Error: `No hay ningun carrito con id:${id_cart}`})
})
//GET ID productos en carrito
carrito.get('/:id/productos', (req, resp) => {
    let id      = req.params.id;
    let carrito = CarritoDao.getById(id)
    if(carrito){
        resp.send(CarritoDao.get_cart(id));
    } else resp.send({Error: `No hay ningun carrito con id:${id}`})
})
carrito.get('/:id/productoss/:idd', (req, resp) => {
    ///Es solo un auxiliar para ver
    resp.send(CarritoDao.get_product_in_cart(req.params.id,req.params.idd))
})
module.exports = carrito;