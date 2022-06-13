const knexProd = require("knex")({
  client:"mysql",
  connection:{
      host:"127.0.0.1",
      user:"root",
      password:"",
      database:"my_sql"
  },
  pool:{min:0, max:10}
})

const path =require("path")

const knexMsg = require('knex')({
  client: 'sqlite3',
  connection: {
      filename:path.resolve(__dirname,"../DB/ecommerce.sqlite")
  },
  useNullAsDefault: true
})

module.exports= {
  knexProd,knexMsg
}
