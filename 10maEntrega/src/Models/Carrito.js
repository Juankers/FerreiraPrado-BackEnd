const mongoose = require("mongoose");

const CarritosCollection = 'Carritos';

const CarritoaSchema = new mongoose.Schema({
    id: {type: number, required: true},
    fecha: {type: date, required: true},
    productos: {type: Array, required: true}
})

const Carrito = mongoose.model(CarritosCollection, CarritoaSchema);

module.exports = Carritos