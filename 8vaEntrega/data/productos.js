
class Productos {
    constructor(nombreTabla){
        this.nombreTabla = nombreTabla
    }
    newTable = async ( knex ) => {
        await knex.schema.hasTable(this.nombreTabla)
        .then( existe => {
            if(!existe){
                return knex.schema.createTable(this.nombreTabla, (table) =>{
                    table.increments('id').primary().notNullable()
                    table.string('nombre').notNullable()
                    table.integer('price').notNullable()
                    table.string("thumbnail").notNullable()
                })
            }
        })
        .catch( error => {
            console.log('error !!!', error.message, error.stack)
            return
        })
    }
    add = async ( knex, product ) =>{
            const save = await knex(this.nombreTabla).insert({...product})
    }
    
    getAll = async knex =>{
            const productos = await knex(this.nombreTabla).select("*");
            return productos
    }
}
module.exports = {Productos};