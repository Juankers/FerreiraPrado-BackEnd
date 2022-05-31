const  ContenedorFirebase  = require("../../contenedores/ContenedorFireBase");

class ProductosDaoFireBase extends ContenedorFirebase{
    constructor(){
        super('productos');
        let productos = this.getAll();
    }
}

module.exports = { ProductosDaoFireBase }