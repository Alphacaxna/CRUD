function editarProducto(id, nombre, precio) {
    document.getElementById('producto-id').value = id;
    document.getElementById('nombre').value = nombre;
    document.getElementById('precio').value = precio;
}

function agregarOActualizarProducto() {
    const id = document.getElementById('producto-id').value;
    const formulario = document.getElementById('formulario-producto');
    const formData = new FormData(formulario);

    let url = 'backend.php';
    let method = 'POST';

    if (id) {
        url += `?id=${id}`;
        method = 'PUT';
    }

    fetch(url, {
        method: method,
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        mostrarResultado(data.mensaje);
        cargarYMostrarProductos();
        limpiarFormulario();
    })
    .catch(error => console.error('Error:', error));
}

function limpiarFormulario() {
    document.getElementById('producto-id').value = '';
    document.getElementById('nombre').value = '';
    document.getElementById('precio').value = '';
}

function mostrarProductos(data) {
    const contenedorResultados = document.getElementById('contenedor-resultados');
    contenedorResultados.innerHTML = '';

    data.forEach(producto => {
        const elementoProducto = document.createElement('div');
        elementoProducto.innerHTML = `
            <p>${producto.nombre}, $${producto.precio}</p>
            <button onclick="editarProducto(${producto.id}, '${producto.nombre}', ${producto.precio})">Editar</button>
            <button onclick="eliminarProducto(${producto.id})">Eliminar</button>
        `;
        contenedorResultados.appendChild(elementoProducto);
    });
}

function mostrarResultado(mensaje) {
    alert(mensaje);
}

function cargarYMostrarProductos() {
    const nombreBusqueda = document.getElementById('busqueda').value;

    let url = 'backend.php';
    if (nombreBusqueda) {
        url += `?nombreBusqueda=${nombreBusqueda}`;
    }

    fetch(url)
    .then(response => response.json())
    .then(data => mostrarProductos(data))
    .catch(error => console.error('Error:', error));
}

// Cargar productos al iniciar la página
document.addEventListener('DOMContentLoaded', function () {
    cargarYMostrarProductos();
});
