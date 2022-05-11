const { knexProd, knexMsg } = require('./options/mariaDB');
const express = require('express');
const handlebars = require('express-handlebars');
const PORT = 8080
const app = express();
const { Server: HttpServer } = require('http');
const { Server:IOServer } = require('socket.io');
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const { Productos } = require('./data/productos');
let productos = new Productos('productos');
productos.newTable(knexProd)

const { Mensajes } = require('./data/mensajes');
let mensajes = new Mensajes('mensajes');
mensajes.newTable(knexMsg);

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('./public'));



app.engine(
    "hbs", 
    handlebars.engine({
        extname: ".hbs",
        defaultLayout: '',
        layoutsDir: __dirname + "/views",
    })
);
app.set('view engine', 'hbs');
app.set("views", "./views");

app.get('/', (req, resp) => {
    resp.render('index')
})

//GET
app.get('/productos', async (req, resp) => {
    let prod = await productos.getAll(knexProd);
    resp.render('productos', { productos: prod})
})
app.get('/chat', async (req, resp) => {
    resp.render('chat', {})
})
//POST
app.post('/productonuevo', async (req, resp) => {
    console.log(await req.body);
    await productos.add( knexProd,req.body )
})


io.on('connection', (socket) => {
    console.log('Cliente conectado');
    mensajes.getAll(knexMsg).then(result => {
            socket.emit('messages', result.payload)
    })
    socket.on('new-message', (data) => {
        mensajes.add(knexMsg,data)
                .then(() => {
                    mensajes.getAll(knexMsg).then(result => {
                            io.sockets.emit('messages', result.payload)
                    })
                })
    })
})
httpServer.listen(PORT, () => {
    console.log('SERVER ON en el puerto: ' + PORT);
});