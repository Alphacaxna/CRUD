function editarProducto(id, nombre, precio) {
    console.log("Editando producto:", id, nombre, precio);
    document.getElementById('producto-id').value = id;
    document.getElementById('nombre').value = nombre;
    document.getElementById('precio').value = precio;

    const botonGuardar = document.querySelector('#btn-guardar');
    botonGuardar.innerText = 'Actualizar Producto';
    botonGuardar.onclick = function () {
        actualizarProducto();
    };
}

function agregarOActualizarProducto() {
    const id = document.getElementById('producto-id').value;
    const formulario = document.getElementById('formulario-producto');
    const formData = new FormData(formulario);

    let url = 'backend.php';
    let method = 'POST';

    let mensajeExitoso = "Producto agregado exitosamente";

    if (id) {
        url += `?id=${id}`;
        method = 'PUT';
        mensajeExitoso = "Producto actualizado exitosamente";
    }

    fetch(url, {
        method: method,
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.error) {
                mostrarResultado(data.error);
            } else {
                mostrarResultado(mensajeExitoso);
                cargarYMostrarProductos();
                limpiarFormulario();
            }
        })
        .catch(error => console.error('Error:', error));
}

function actualizarProducto() {
    const id = document.getElementById('producto-id').value;
    const formulario = document.getElementById('formulario-producto');
    const formData = new FormData(formulario);

    fetch(`backend.php?id=${id}`, {
        method: 'PUT',
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.error) {
                mostrarResultado(data.error);
            } else {
                mostrarResultado("Producto actualizado exitosamente");
                cargarYMostrarProductos();
                limpiarFormulario();
                const botonGuardar = document.querySelector('#btn-guardar');
                botonGuardar.innerText = 'Guardar Producto';
                botonGuardar.onclick = function () {
                    agregarOActualizarProducto();
                };
            }
        })
        .catch(error => console.error('Error:', error));
}

function eliminarProducto(id) {
    console.log("Eliminando producto:", id);
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        fetch(`backend.php?id=${id}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                mostrarResultado(data.mensaje);
                cargarYMostrarProductos();
            })
            .catch(error => console.error('Error al eliminar:', error));
    }
}

function mostrarProductos(data) {
    const contenedorResultados = document.getElementById('contenedor-resultados');
    contenedorResultados.innerHTML = '';

    if (data.hasOwnProperty("data")) {
        data = data.data;
    }

    if (Array.isArray(data)) {
        data.forEach(producto => {
            const elementoProducto = document.createElement('div');
            elementoProducto.innerHTML = `
                <p>${producto.nombre}, $${producto.precio}</p>
                <button type="button" onclick="editarProducto(${producto.id}, '${producto.nombre}', ${producto.precio})">Editar</button>
                <button type="button" onclick="eliminarProducto(${producto.id})">Eliminar</button>
            `;
            contenedorResultados.appendChild(elementoProducto);
        });
    } else {
        console.error('La respuesta del servidor no es un array:', data);
    }
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
        .then(data => {
            console.log(data); 
            mostrarProductos(data);
        })
        .catch(error => console.error('Error:', error));
}

document.addEventListener('DOMContentLoaded', function () {
    cargarYMostrarProductos();
});
