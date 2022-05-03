const fs = require('fs')

class Carrito{
    constructor(){
        this.nombreArchivo = './src/files/cart.json'
    }    
    new() {
        let data = fs.readFileSync(this.nombreArchivo,'utf-8')
        let dataParse = JSON.parse(data)
        let tamaño = dataParse.length
        let id = null;
        let fecha = Date()
        if(tamaño !== 0){
            id = (parseInt(dataParse[tamaño-1].id)+1).toString()
        }else{
            id = "1"
        }
        let nuevo = {
            id        : id,
            fecha     : fecha,
            productos : []
        }
        dataParse.push(nuevo)
        fs.writeFileSync(this.nombreArchivo, JSON.stringify(dataParse,null,2))
        return id
    }
    getById (id_cart){
        let data = fs.readFileSync(this.nombreArchivo,'utf-8')
        let dataParse = JSON.parse(data)
        let mostrar
        mostrar = null
        dataParse.forEach(element => {
            if(id_cart === element.id){
                mostrar = element
            }
        });
        return mostrar;
    }
    get_product (id_cart){
        let data = fs.readFileSync(this.nombreArchivo,'utf-8')
        let dataParse = JSON.parse(data)
        let carrito = null
        dataParse.forEach(element => {
            if(id_cart === element.id){
                carrito = element
            }
        });
        return carrito.productos;
    }
    getAll(){
        let data = fs.readFileSync(this.nombreArchivo,'utf-8')
        let dataParse = JSON.parse(data)
        return dataParse
    }
    deleteById(id_cart){
        let data = fs.readFileSync(this.nombreArchivo,'utf-8')
        let dataParse = JSON.parse(data)
        let contador = 0
        dataParse.forEach(element => {
            if(id_cart === element.id){
                dataParse.splice(contador,1)
            }
            contador = contador + 1
        });
        fs.writeFileSync(this.nombreArchivo, JSON.stringify(dataParse),null,2)
    }
    delete_Product(id_cart, id_prod){
        let data = fs.readFileSync(this.nombreArchivo,'utf-8')
        let dataParse = JSON.parse(data)
        let contador = 0
        dataParse.forEach(cart => {
            if(id_cart === cart.id){
                cart.forEach(element =>{
                    if(id_prod === element.id){
                        cart.splice(contador,1)
                    }      
                    contador = contador + 1
                })
            }
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
    add_product(id_cart,producto){
        let data = fs.readFileSync(this.nombreArchivo,'utf-8')
        let dataParse = JSON.parse(data)
        let carrito = null
        if(dataParse.length > 0){
            let e = dataParse.find(elem=>elem.id == id_cart);
            if(e){
                e.productos.push(producto);
                carrito = e;
            }
            fs.writeFileSync(this.nombreArchivo, JSON.stringify(dataParse),null,2)
        }
        return carrito
    }
}
module.exports = {Carrito}