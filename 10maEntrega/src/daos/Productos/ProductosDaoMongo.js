const ContainerMongo = require('../../contenedores/ContainerMongo')
const userModel = require('../../Models/Productos')

class UserDaoMongo extends ContainerMongo{
  constructor() {
    super(userModel);
  }

} 

module.exports = { UserDaoMongo }