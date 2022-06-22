const socket = io.connect();

function renderMensajes(data) {
    const html = data.map((elem, index) => {
        return(`
                <div>
                    <strong style="color: blue;"> ${elem.email}</strong>
                    <em style="color: red;"     >[${elem.hora}] </em>:
                    <em style="color: green;"   > ${elem.mensaje}  </em>
                </div>
                `)
    }).join(" ");
    document.getElementById('messages').innerHTML = html;
}
function addMessage(e) {
    const nuevaHora = new Date().toDateString();
    let mensaje   = {
        author : {
            email    : document.getElementById('mail').value,
            nombre   : document.getElementById('nombre').value,
            apellido : document.getElementById('apellido').value,
            edad     : document.getElementById('edad').value,
            icono    : document.getElementById('icono').value
        },
        text : document.getElementById('mensaje').value,
        hora    : nuevaHora
    };
    socket.emit('new-message', mensaje);
    return false;
}
socket.on('messages', data => {
    renderMensajes(data);
})


// Funcion para renderiza los mensajes antiguos que son traidos desde la DB en el document HTML
function oldMsg(data) {
    let html2 = data.map((elem, i) => {
        return (`
        <div>
            <strong style="color:blue;"${elem.author.email}</strong>
            <em style="color: red;"  >[${newDate.toString()}</em>:
            <em style="color: green;" >${elem.text}      </em>
        </div>
        `)
    }).join(" ");
    document.getElementById('pantallaOld').innerHTML = html2;
};


document.getElementById("btnOldMsg").addEventListener("click", async function () {

    const msgNormalized = await fetch('http://localhost:8080/mensaje/norm')
        .then(res => res.json())
        .then(data => { return data })
        .catch(err => console.log(err))

    console.log(msgNormalized)
    const msgNormalizedLength = JSON.stringify(msgNormalized).length

    /* -------------- Desnomarlizacion del archivo recibido desde el back -------------- */
    const schemaAuthor = new normalizr.schema.Entity('author', {}, { idAttribute: 'id' });
    const schemaMensaje = new normalizr.schema.Entity('mensaje', {
        author: schemaAuthor
    }, { idAttribute: '_id' })
    const schemaMensajes = new normalizr.schema.Entity('mensajes', {
        mensajes: [schemaMensaje]
    }, { idAttribute: 'id' })

    const msgDesnormalized = normalizr.denormalize(msgNormalized.result, schemaMensajes, msgNormalized.entities)
    //console.log(msgDesnormalized)
    const msgDesnormalizedLength = JSON.stringify(msgDesnormalized).length
    console.log('Normalizr Length', msgNormalizedLength);
    console.log('Desnormalizr Length', msgDesnormalizedLength);

    /* ---------------------------------------------------------------------------------- */

    oldMsg(msgDesnormalized.mensajes) // Envio del archivo desnormalizo para su render en el front

    let porcentual = parseInt((msgNormalizedLength * 100) / msgDesnormalizedLength)
    console.log(`Compresión: ${porcentual}%`)
    document.getElementById('compress').innerText = porcentual

});

// PRODUCTOS 

// ENVIAR PRODUCTOS POR SOCKET
document.getElementById('btnForm').addEventListener('click', () => { validarForm() }); // al apretar el boton ejecuta la fn valida()

function validarForm() {
    let title = document.getElementById('title').value;
    let price = document.getElementById('price').value;
    let thumbnail = document.getElementById('thumbnail').value;
    if (title === "" || price === "" || thumbnail === "") {
        alert(`CAMPOS REQUERIDOS PARA AGREGAR PRODUCTO`)
    } else {
        let newProd = {
            title: document.getElementById('title').value,
            price: document.getElementById('price').value,
            thumbnail: document.getElementById('thumbnail').value
        };
        socket.emit('new-producto', newProd)

        document.getElementById('title').value = ""
        document.getElementById('price').value = ""
        document.getElementById('thumbnail').value = ""
    };
};


// GET 
const fragment = document.createDocumentFragment();
const tabla    = document.getElementById('tableProd');
const template = document.getElementById('templateList').content;

// Traer productos
document.addEventListener('DOMContentLoaded', e => { fetchData() });

const fetchData = async () => {
    const res = await fetch('http://localhost:8080/producto');
    const data = await res.json();
    console.log(data)
    verProdHtml(data);
};

const verProdHtml = data => {
    data.forEach(producto => {

        template.getElementById('prodTitle').textContent = producto.title;
        template.getElementById('prodPrice').textContent = producto.price;
        template.getElementById('prodImg').setAttribute("src", producto.thumbnail);

        const clone = template.cloneNode(true)
        fragment.appendChild(clone)
    });
    tabla.appendChild(fragment)
};


socket.on('new-prod-server', async data => {
    let array = [] 
    array.push(await data)
    verProdHtml(array)

})