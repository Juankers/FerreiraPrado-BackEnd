const socket = io.connect();

function renderMensajes(data) {
    const html = data.map((elem, index) => {
        return(`
                <div>
                    <strong style="color: blue;"> ${elem.mail}</strong>
                    <em style="color: red;"     >[${elem.hora}] </em>:
                    <em style="color: green;"   > ${elem.mensaje}  </em>
                </div>
                `)
    }).join(" ");
    document.getElementById('messages').innerHTML = html;
}
function addMessage(e) {
    const nuevaHora = new Date().toDateString();
    const mensaje   = {
        mail    : document.getElementById('mail').value,
        mensaje : document.getElementById('mensaje').value,
        hora    : nuevaHora
    };
    socket.emit('new-message', mensaje);
    return false;
}
socket.on('messages', data => {
    renderMensajes(data);
})
