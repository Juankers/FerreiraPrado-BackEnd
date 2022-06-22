const {ContainerArchivo}=require("../../Contenedores/ContenedorArchivos");
const fs = require('fs');
class ProductoDaoArchivo extends ContainerArchivo{
    constructor(){
        super('./src/files/productos.json')
    }    
    save(objeto) {
        let data = fs.readFileSync(this.nombreArchivo,'utf-8')
        let dataParse = JSON.parse(data)
        let tamaño = dataParse.length
        let id = null;
        if(tamaño !== 0){
            id = (parseInt(dataParse[tamaño-1].id)+1).toString()
        }else{
            id = "1"
        }
        const nuevo = {
            id    : id,
            fecha : Date(),
            ...objeto
        }
        dataParse.push(nuevo)
        fs.writeFileSync(this.nombreArchivo, JSON.stringify(dataParse,null,2))
        return nuevo
    }
    getById (number){
        let data = fs.readFileSync(this.nombreArchivo,'utf-8')
        let dataParse = JSON.parse(data)
        let mostrar
        mostrar = null
        dataParse.forEach(element => {
            if(number === element.id){
                mostrar = element
            }
        });
        return mostrar;
    }
    getAll(){
        let data = fs.readFileSync(this.nombreArchivo,'utf-8')
        let dataParse = JSON.parse(data)
        return dataParse
    }
    deleteById(number){
        let data = fs.readFileSync(this.nombreArchivo,'utf-8')
        let dataParse = JSON.parse(data)
        let contador = 0
        dataParse.forEach(element => {
            if(number === element.id){
                dataParse.splice(contador,1)
            }
            contador = contador + 1
        });
        fs.writeFileSync(this.nombreArchivo, JSON.stringify(dataParse),null,2)
    }
    deleteAll(){
        let data = fs.readFileSync(this.nombreArchivo,'utf-8')
        let dataParse = JSON.parse(data)
        let tamaño = dataParse.length
        dataParse.splice(0,tamaño)
        fs.writeFileSync(this.nombreArchivo, JSON.stringify(dataParse),null,2)

    }
    edit(objeto){
        let data = fs.readFileSync(this.nombreArchivo,'utf-8')
        let dataParse = JSON.parse(data)
        dataParse.forEach(element => {
            if(objeto.id === element.id){
                element.id = objeto.id
                element.fecha = objeto.fecha
                element.nombre = objeto.nombre
                element.price = objeto.price
                element.thumbnail = objeto.thumbnail
            }
        });
        fs.writeFileSync(this.nombreArchivo, JSON.stringify(dataParse),null,2)
    }
    getRand(){
        let data = fs.readFileSync(this.nombreArchivo,'utf-8')
        let dataParse = JSON.parse(data)
        let rand= dataParse[ Math.floor( dataParse.length * Math.random() ) ]
        return rand
    }
}
module.exports = {ProductoDaoArchivo}