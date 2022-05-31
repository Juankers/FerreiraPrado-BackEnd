const  ContenedorFirebase  = require("../../contenedores/ContenedorFireBase");

class CarritoDaoFireBase extends ContenedorFirebase{
    constructor(){
        super('carrito');
    }
    async save(carrito = { productos: [] }) {
        return super.save(carrito)
    }
}

module.exports = { CarritoDaoFireBase }