const socket = io.connect();

function renderProductos(data) {
    const html = data.map((elem, index) => {
        return(`
                <tbody>
                    <tr>
                        <td scope="col">${elem.nombre}   </td>
                        <td scope="col">${elem.price}$   </td>
                        <td scope="col">${elem.thumbnail}</td>
                    </tr>
                </tbody>
                `)
    }).join(" ");
    document.getElementById('productos').innerHTML = html;
}
function addProducto(e) {
    const producto = {
        nombre    : document.getElementById('nombre').value,
        price     : document.getElementById('precio').value,
        thumbnail : document.getElementById('url').value,
    };
    socket.emit('new-producto', producto);
    return false;
}
socket.on('productos', data => {
    renderProductos(data);
})