const express = require('express');
const handlebars = require('express-handlebars');
const PORT = 8080
const app = express();
const { Server: HttpServer } = require('http');
const { Server:IOServer } = require('socket.io');
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('./public'));

class Contenedor{
    constructor(nombreArchivo){
        this.nombreArchivo = ('./'+nombreArchivo+'.json')
    }    
    async save(obj) {
        const fs = require('fs')
        var data = await fs.promises.readFile(this.nombreArchivo,'utf-8')
        var dataParse = JSON.parse(data)
        var tamaño = dataParse.length
        let id = null;
        if(tamaño !== 0){
            id = (parseInt(dataParse[tamaño-1].id)+1).toString()
        }else{
            id = "1"
        }
        const newItem = {
            id: id,
            ...obj
            }
        dataParse.push(newItem)
        await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(dataParse,null,2))
        return newItem
    }
    async getById (number){
        const fs = require('fs')
        var data = await fs.promises.readFile(this.nombreArchivo,'utf-8')
        var dataParse = JSON.parse(data)
        var mostrar
        mostrar = null
        dataParse.forEach(element => {
            if(number === element.id){
                mostrar = element
            }
        });
        return mostrar;
    }
    async getAll(){
        const fs = require('fs')
        var data = await fs.promises.readFile(this.nombreArchivo,'utf-8')
        var dataParse = JSON.parse(data)
        return dataParse
    }
    async deleteById(number){
        const fs = require('fs')
        var data = await fs.promises.readFile(this.nombreArchivo,'utf-8')
        var dataParse = JSON.parse(data)
        var contador = 0
        dataParse.forEach(element => {
            if(number === element.id){
                dataParse.splice(contador,1)
            }
            contador = contador + 1
        });
        await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(dataParse),null,2)
    }
    async deleteAll(){
        const fs = require('fs')
        var data = await fs.promises.readFile(this.nombreArchivo,'utf-8')
        var dataParse = JSON.parse(data)
        var tamaño = dataParse.length
        dataParse.splice(0,tamaño)
        try{
            await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(dataParse),null,2)
        }
        catch(err){
            console.log('Error al editar el archivo',err)
        }
    }
    async edit(id,price,nombre,thumbnail){
        const fs = require('fs')
        var data = await fs.promises.readFile(this.nombreArchivo,'utf-8')
        var dataParse = JSON.parse(data)
        dataParse.forEach(element => {
            if(id === element.id){
                element.nombre = nombre
                element.price = price
                element.thumbnail = thumbnail
            }
        });
        await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(dataParse),null,2)
    }
    async getRand(){
        const fs = require('fs')
        var data = await fs.promises.readFile(this.nombreArchivo,'utf-8')
        var dataParse = JSON.parse(data)
        var rand= dataParse[ Math.floor( dataParse.length * Math.random() ) ]
        return rand
    }
}
const objeto = new Contenedor('Productos')

app.engine(
    "hbs", 
    handlebars.engine({
        extname: ".hbs",
        defaultLayout: '',
        layoutsDir: __dirname + "/views/layouts",
    })
);
app.set('view engine', 'hbs');
app.set("views", "./views");

app.get('/', (req, resp) => {
    resp.render('index')
})

//GET
app.get('/productos', async (req, resp) => {
    let productos = await objeto.getAll();
    resp.render('productos', { productos: productos})
})
app.get('/chat', async (req, resp) => {
    resp.render('chat', {})
})
//POST
app.post('/productonuevo', async (req, resp) => {
    console.log(await req.body);
    await objeto.save(req.body)
})

const messages = [
    { mail: "Juan" , hora : 1, mensaje: 'Hola que tal?'},
    { mail: "Pedro", hora : 1, mensaje: 'Muy y vos?'},
    { mail: "Ana"  , hora : 1, mensaje: 'Genial'}
];
const productos = [
    {
      "nombre": "Celularrrrrrr",
      "price": 100,
      "thumbnail": "https://celular.com",
      "id": "1"
    },
    {
      "nombre": "Computadora",
      "price": 200,
      "thumbnail": "https://computadora.com",
      "id": "2"
    },
    {
      "nombre": "Calculadora",
      "price": 300,
      "thumbnail": "https://calculadora.com",
      "id": "3"
    }
];
//Tuve un problema con la clase Contenedor, ya que utilizaba async y await
// y adentro de io.on no me deja utilizarlo
//Por eso mismo implementé los productos y los mensajes acá adentro

io.on('connection', (socket) => {
    console.log('Cliente conectado');
    socket.emit('productos', productos);
    socket.emit('messages', messages);

    socket.on('new-producto', data => {
        productos.push(data);
        io.sockets.emit('productos', productos);
    })
    socket.on('new-message', data => {
        messages.push(data);
        io.sockets.emit('messages', messages);
    })
})
httpServer.listen(PORT, () => {
    console.log('SERVER ON en el puerto: ' + PORT);
});