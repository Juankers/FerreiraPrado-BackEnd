const ContainerMongo = require('../../contenedores/ContainerMongo');
const CarritoModel = require('../../Models/Carrito')

class CarritoDaoFireBase extends ContainerMongo{
  constructor() {
    super(CarritoModel);
  }

} 

module.exports = { CarritoDaoFireBase }