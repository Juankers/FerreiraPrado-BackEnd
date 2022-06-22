const MensajeModel =require('../models/mensajeSchema.js')
const schema       = require('normalizr')
const normalize    = require('normalizr')

class Mensajes {
    constructor() { }
    async addMsg(req, res) {
        const data = await { ...req }
        const mensaje = {
            author: {
                email    : data.mensajes.author.email,
                nombre   : data.mensajes.author.nombre,
                apellido : data.mensajes.author.apellido,
                edad     : data.mensajes.author.edad,
                icono    : data.mensajes.author.icono
            },
        }
        mensaje.text = data.mensajes.text,
        hora.text    = data.mensajes.hora
        const newMsg = await MensajeModel.create(mensaje);
    }
    async findAllMsg(req, res) {
        let mensajes = await MensajeModel.find();
        let id = 'mensajes'
        return res.status(200).json({ id, mensajes });
    }
    async normalizedData(req, res) {
            let mensajes = await MensajeModel.find();
            let msgOriginal = {
                id: 'mensajes',
                mensajes: mensajes.map( mensaje => ({...mensaje._doc}))
            }
            const schemaAuthor = new schema.Entity('author', {}, { idAttribute: 'email' });
            const schemaMensaje = new schema.Entity('mensaje', {
                author: schemaAuthor
            }, { idAttribute: '_id' })
            const schemaMensajes = new schema.Entity('mensajes', {
                mensajes: [schemaMensaje]
            }, { idAttribute: 'id' })
            let normalizedData = normalize(msgOriginal, schemaMensajes);
            console.log(util.inspect(normalizedData, false, 5, true))
            console.log("length Original", JSON.stringify(msgOriginal).length);
            console.log("length Normalize", JSON.stringify(normalizedData).length);
            res.send(normalizedData)
    }
}
module.exports = { Mensajes }