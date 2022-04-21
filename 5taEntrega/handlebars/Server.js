const express = require('express');
const handlebars = require('express-handlebars');
const PORT = 8080
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

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


app.get('/', (req, res) => {
    res.status(200).render('index')
})

const server = app.listen(PORT, () => {
    console.log('La aplicacion express esta escuchando');
})

//GET
app.get('/productos', async (req, resp) => {
    let productos = await objeto.getAll();
    resp.render('productos', { productos: productos})
})
//POST
app.post('/productonuevo', async (req, resp) => {
    console.log(await req.body);
    await objeto.save(req.body)

    resp.redirect('/productos');
})

