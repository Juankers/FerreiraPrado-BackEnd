const express    = require('express');
const { Router } = express;
const carrito    = Router();

const { Carrito   } = require('../manage/cart');
const { Productos } = require('../manage/productos');
let cart      = new Carrito();
let productos = new Productos();

//Carrito
//POST nuevo
carrito.post('/', (req, resp) => {
    resp.send(cart.new());
})
//POST productos en carrito
carrito.post('/:id/productos', (req, resp) => {
    let id      = req.params.id;
    let carrito = cart.getById(id);
    if(carrito){
        // let productoNuevo = req.body;
        let productoNuevo = productos.getRand();
        resp.send(cart.add_product(id, productoNuevo));
    } else resp.send({Error: `No hay ningun carrito con id:${id}`}) 
})
//DELETE carrito
carrito.delete('/:id', (req, resp) => {
    let id      = req.params.id;
    let carrito = cart.getById(id);
    if(carrito){
    resp.send(cart.deleteById(id));
    } else resp.send({Error: `No hay ningun carrito con id:${id}`}) 
})
//DELETE producto en carrito
carrito.delete('/:id/productos/:id_prod', (req, resp) => {
    let id_cart  = req.params.id;
    let id_prod  = req.params.id_prod;
    let carrito  = cart.getById(id_cart)
    if(carrito){
        let producto = cart.get_product_in_cart(id_cart,id_prod)
        if(producto){
            resp.send(cart.delete_Product(id_cart,id_prod));
        } else resp.send({Error: `No hay ningun producto con id:${id_prod} en el carrito`})
    } else resp.send({Error: `No hay ningun carrito con id:${id_cart}`})
})
//GET ID productos en carrito
carrito.get('/:id/productos', (req, resp) => {
    let id      = req.params.id;
    let carrito = cart.getById(id)
    if(carrito){
        resp.send(cart.get_cart(id));
    } else resp.send({Error: `No hay ningun carrito con id:${id}`})
})
carrito.get('/:id/productoss/:idd', (req, resp) => {
    resp.send(cart.get_product_in_cart(req.params.id,req.params.idd))
})
module.exports = carrito;