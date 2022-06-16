
class Mensajes {
    constructor(nombreTabla) {
        this.nombreTabla = nombreTabla
    }
    newTable = async ( knex ) => {
        await knex.schema.hasTable(this.nombreTabla)
        .then( existe => {
            if(!existe){
                return  knex.schema.createTable(this.nombreTabla, (table) =>{
                    table.increments('mail').primary().notNullable()
                    table.string('nombre').notNullable();
                    table.string('apellido').notNullable();
                    table.string('edad').notNullable()
                    table.string('icono').notNullable()
                    table.string('hora')
                    table.string('message').notNullable();
                })
            }
        })
        .catch( error => {
            console.log('error !!!', error.message, error.stack)
            return
        })
    }
    add = async ( knex,msg ) =>{
        try {
            const save = await knex(this.nombreTabla).insert({...msg})
            return {
                status  : 'success',
                payload : save
            }
        } catch (error) {
            console.log(error)
            return {
                Error:{
                    status  : "Error save.",
                    message : error.message
                }
            }
        }
    }
    
    getAll = async ( knex ) =>{
        try{
            const mensajes = await knex(this.nombreTabla).select("*");
            return {
                status  : 'success',
                payload : mensajes
            }
        }
        catch{(error)=>{
            return {
                Error:{
                    status  : "Error read database.",
                    message : error.message
                }
            }
        }}    
    }
}
module.exports = {Mensajes};


