const express = require('express');
const handlebars = require('express-handlebars');
const { Server: HttpServer } = require('http');
const { Server:IOServer } = require('socket.io');
const mongoose = require('mongoose');

const { Productos } = require('./data/productos');
let productos = new Productos('productos');

const { Mensajes } = require('./data/mensajes');
let mensajes = new Mensajes('mensajes');



const prod = express();
const msg = express();
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const PORT = 8080;

// MOONGOSE
const uri = 'mongodb+srv://Juankers:juancruz@cluster0.gsiau.mongodb.net/?retryWrites=true&w=majority'
const options = {
    useNewUrlParser: true, 
    useUnifiedTopology: true
  }
mongoose.connect(uri, options)
    .then(() => { console.log('Conectado a Mongo') },
        err => { err }
    )


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
    let prod = await productos.findAll();
    resp.render('productos', { productos: prod})
})
app.get('/chat', async (req, resp) => {
    resp.render('chat', {})
})
app.get('/productos-test', async (req, resp) => {
    let prod = await productos.makefake();
    resp.render('productos', { productos: prod})
})
//POST
app.post('/productonuevo', async (req, resp) => {
    await productos.add(req);
})

let toChat = []

io.on('connection', socket => {
    io.sockets.emit('new-message-server', toChat)
    
    socket.on('new-message', async data => {
        const mensajes = await data;
        toChat.push(data);
        mensajes.addMsg({ mensajes })
        io.sockets.emit('new-message-server', toChat)
    });

    socket.on('new-producto', async data => {
        const producto = await data;
        productos.add({ producto })
        io.sockets.emit('new-prod-server', producto)
    });

});
httpServer.listen(PORT, () => {
    console.log('SERVER ON en el puerto: ' + PORT);
});