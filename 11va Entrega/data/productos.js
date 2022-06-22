const ProductoModel = require('../models/productoSchema.js');
const faker = require('faker');
faker.locale = 'es';

class Productos {
    constructor() { }
    async add(req) {
        const data = {
            title     : req.body.nombre,
            price     : req.body.price,
            thumbnail : req.body.thumbnail
        }
        const newProducto = await ProductoModel.create(data);
        return newProducto;
    }
    async findAll() {
        const prodInDb = await ProductoModel.find({});
        return prodInDb;
    }
    async findByID(req) {
        const _id = req.params.id;
        const prodById = await ProductoModel.findOne({ _id });
        return prodById;

    }
    async deleteProd(req) {
        const _id = req.params.id;
        const prodToDel = await ProductoModel.deleteOne({ _id });
        return prodToDel;
    }
    async update(req) {
        const _id = req.params.id;
        const data = { ...req.body };
        const prodUpdated = await ProductoModel.updateOne({ _id }, data, { new: true });
        return prodUpdated;
    }
    async makefake () {
        let productos = []
        for(let i = 0; i < 5; i++){
            await productos.push({
                nombre    : faker.commerce.productName(),
                price     : faker.commerce.price(),
                thumbnail : faker.image.imageUrl()
            })
        }
        console.log(productos)
        return productos;
    }
}

module.exports = { Productos }