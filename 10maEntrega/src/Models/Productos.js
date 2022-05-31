const mongoose = require("mongoose");

const ProdutosCollection = 'Productos';

const ProductoSchema = new mongoose.Schema({
    id: {type: String, required: true, max: 100},
    nombre: {type: String, required: true, max: 100},
    descripcion: {type: String, required: true},
    codigo: {type: Number, required: true},
    foto: {type: String, required: true},
    precio: {type: Number, required: true},
    stock: {type: Number, required: true}
})

const Productos = mongoose.model(ProdutosCollection, ProductoSchema);

module.exports = Productos