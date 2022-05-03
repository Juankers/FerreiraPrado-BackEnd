const express       = require('express');
const { Router }    = express;
const productos     = Router();
let isAdministrador = false;

const { Productos } = require('../manage/productos');
let prod = new Productos();

//Productos
//GET productos
productos.get('/:id?', (req, resp) => {
    let productos = prod.getAll();
    if(productos.lenght > 0){
        if(req.params.id){
            let id = req.params.id;
            resp.send(prod.getById(id));
        } else resp.send(productos);
    } else resp.send({Error: 'No hay productos cargados'})
        
})
//POST
productos.post('/', (req, resp) => {
    if(isAdministrador){
        // let producto = rep.body;
        let producto = {
            nombre      : "Celular" ,
            descripcion : "Este es un celular común y corriente",
            codigo      : 564,
            foto        : "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.falabella.com.ar%2Ffalabella-ar%2Fproduct%2F2984872%2FCelular-libre-A7-negro-64GB-4GB-RAM%2F2984872&psig=AOvVaw36paDSvUJ-XHbL2TA5ii0E&ust=1651682840732000&source=images&cd=vfe&ved=0CAwQjRxqFwoTCPj287fkw_cCFQAAAAAdAAAAABAQ", 
            precio      : 5000,
            stock       : 50
        }
        resp.send(prod.save(producto));
    } else resp.send({Error: '-1', descripcion: 'No autorizado'})
})
//PUT
productos.put('/:id', (req, resp) => {
    if(isAdministrador){
        let id       = req.params.id;
        let producto = prod.getById(id);
        if(producto){
            let productoNuevo = req.body;
            resp.send(prod.edit(id,productoNuevo));
        } else resp.send({Error: `No hay ningun producto con id:${id}`})
    } else resp.send({Error: '-1', descripcion: 'No autorizado'})
})
//DELETE
productos.delete('/:id', (req, resp) => {
    if(isAdministrador){
        let productos = prod.getAll();
        if(productos.lenght > 0){
            let id       = req.params.id
            let producto = prod.getById(id)
            if(producto){
                resp.send(prod.deleteById(id));  
            } else resp.send({Error: `No hay ningun producto con id:${id}`})
        } else resp.send({Error: 'No hay productos cargados'})
    } else resp.send({Error: '-1', descripcion: 'No autorizado'})
})

module.exports = productos;