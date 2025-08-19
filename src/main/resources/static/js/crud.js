async function agregarProducto() {
    const id = document.getElementById("idProducto").value;
    const nombre = document.getElementById("NProducto").value;
    const marca = document.getElementById("marca").value;
    const categoria = document.getElementById("categoria").value;
    const color = document.getElementById("color").value;
    const dimension = document.getElementById("dimension").value;
    const descripcion = document.getElementById("itemDetailsDescription").value;
    const cantidad = document.getElementById("cantidad").value;

    // Verificar si todos los campos están llenos
    if (!id || !nombre || !marca || !categoria || !color || !dimension || !descripcion || !cantidad) {
        alert("Por favor, completa todos los campos antes de agregar el producto.");
        return; // Salir de la función si algún campo está vacío
    }


    const producto = {
        id: id,
        nombre: nombre,
        marca: marca,
        categoria: categoria,
        color: color,
        dimension: dimension,
        descripcion: descripcion,
        cantidad: parseInt(cantidad),
    };

    try {
        const response = await fetch("http://localhost:8080/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(producto),
        });

        if (response.ok) {
            const nuevoProducto = await response.json();
            alert("Producto agregado exitosamente: " + nuevoProducto.nombre);
            document.getElementById("productoForm").reset();
            obtenerProductos(); // Actualizar la lista de productos
        } else {
            alert("Error al agregar el producto");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error al conectar con la API");
    }
}
function mostrarNotificaciones() {
    const listaNotificaciones = document.getElementById("lista-notificaciones");
    listaNotificaciones.style.display = listaNotificaciones.style.display === "none" ? "block" : "none";
}
let productosGlobal = []; // Variable global para almacenar todos los productos

async function obtenerProductos() {
    try {
        const response = await fetch("http://localhost:8080/");
        const productos = await response.json();
        productosGlobal = productos; // Guardar la lista de productos para búsquedas y notificaciones

        // Notificaciones de productos con bajos suministros
        const listaNotificaciones = document.getElementById("lista-notificaciones");
        const puntoRojo = document.getElementById("punto-rojo");
        listaNotificaciones.innerHTML = ''; // Limpiar contenido previo

        let productosBajos = productos.filter(producto => producto.cantidad <= 6);
        if (productosBajos.length > 0) {
            puntoRojo.style.display = "block"; // Mostrar el punto rojo si hay productos bajos
            productosBajos.forEach(producto => {
                const notificacion = document.createElement("p");
                notificacion.textContent = `Advertencia: El producto "${producto.nombre}" categoria "${producto.categoria}" tiene pocos suministros.`;
                listaNotificaciones.appendChild(notificacion);
            });
        } else {
            puntoRojo.style.display = "none"; // Ocultar el punto rojo si no hay notificaciones
            const sinNotificacion = document.createElement("p");
            sinNotificacion.textContent = "No hay productos con bajo suministro.";
            listaNotificaciones.appendChild(sinNotificacion);
        }

        mostrarProductos(productos); // Mostrar la lista completa
    } catch (error) {
        console.error("Error:", error);
       alert("Error al obtener la lista de productos");
    }
}

function buscarProducto() {
    const terminoBusqueda = document.getElementById("campoBusqueda").value.toLowerCase();
    const resultados = productosGlobal.filter(producto => 
        producto.nombre.toLowerCase().includes(terminoBusqueda)
    );
    mostrarProductos(resultados, true); // Mostrar solo los resultados de búsqueda
}

function mostrarProductos(productos, esBusqueda = false) {
    const contenedor = document.getElementById("lista-productos");
    contenedor.innerHTML = ''; // Limpiar el contenedor
    contenedor.style.display = productos.length ? "block" : "none";

    const tabla = document.createElement("table");
    tabla.classList.add("table-container");

    tabla.innerHTML = `
        <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Marca</th>
            <th>Categoría</th>
            <th>Color</th>
            <th>Dimensión</th>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Acciones</th>
        </tr>
    `;

    productos.forEach(producto => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>${producto.marca}</td>
            <td>${producto.categoria}</td>
            <td>${producto.color}</td>
            <td>${producto.dimension}</td>
            <td>${producto.descripcion}</td>
            <td>${producto.cantidad}</td>
        `;

        const columnaAcciones = document.createElement("td");

        // Botón de Eliminar
        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.classList.add("btn-eliminar");
        botonEliminar.onclick = () => eliminarProducto(producto.id);
        columnaAcciones.appendChild(botonEliminar);

        // Botón de Modificar
        const botonModificar = document.createElement("button");
        botonModificar.textContent = "Modificar";
        botonModificar.classList.add("btn-modificar");
        botonModificar.onclick = () => toggleFormularioModificar(producto.id);
        columnaAcciones.appendChild(botonModificar);

        // Botón de Salida
        const botonSalida = document.createElement("button");
        botonSalida.textContent = "Salida";
        botonSalida.classList.add("btn-salida");
        botonSalida.onclick = () => toggleFormularioSalida(producto.id);
        columnaAcciones.appendChild(botonSalida);

        fila.appendChild(columnaAcciones);
        tabla.appendChild(fila);

        // Fila de Modificación
        const filaModificar = document.createElement("tr");
        filaModificar.id = `formulario-modificar-${producto.id}`;
        filaModificar.style.display = "none";
        filaModificar.innerHTML = `
            <td colspan="9">
                <div class="formulario-modificar">
                    <label>Nombre: <input id="nombre-${producto.id}" value="${producto.nombre}"></label>
                    <label>Marca: <input id="marca-${producto.id}" value="${producto.marca}"></label>
                    <label>Categoría: <input id="categoria-${producto.id}" value="${producto.categoria}"></label>
                    <label>Color: <input id="color-${producto.id}" value="${producto.color}"></label>
                    <label>Dimensión: <input id="dimension-${producto.id}" value="${producto.dimension}"></label>
                    <label>Descripción: <input id="descripcion-${producto.id}" value="${producto.descripcion}"></label>
                    <label>Cantidad: <input id="modificar-cantidad-${producto.id}" type="number" value="${producto.cantidad}"></label>
                    <button onclick="guardarCambios(${producto.id})">Guardar Cambios</button>
                    <button onclick="toggleFormularioModificar(${producto.id})">Cancelar</button>
                </div>
            </td>
        `;
        tabla.appendChild(filaModificar);

        // Fila de Salida
        const filaSalida = document.createElement("tr");
        filaSalida.id = `formulario-salida-${producto.id}`;
        filaSalida.style.display = "none";
        filaSalida.innerHTML = `
            <td colspan="9">
                <div class="formulario-salida">
                    <label>Nombre Encargado: <input id="encargado-${producto.id}" type="text" required></label>
                    <label>Nombre Solicitante: <input id="solicitante-${producto.id}" type="text" required></label>
                    <label>Producto: <input type="text" value="${producto.nombre}" disabled></label>
                    <label>Cantidad: <input id="salida-cantidad-${producto.id}" type="number" min="1" required></label>
                    <label>Categoría: <input type="text" value="${producto.categoria}" disabled></label>
                    <input type="hidden" id="productoId-${producto.id}" value="${producto.id}">
                    <button onclick="registrarSalida(${producto.id}, '${producto.nombre}', '${producto.categoria}')">Registrar Salida</button>
                    <button onclick="toggleFormularioSalida(${producto.id})">Cancelar</button>
                </div>
            </td>
        `;
        tabla.appendChild(filaSalida);
    });

    contenedor.appendChild(tabla);
}



function mostrarProductos(productos) {
    const tabla = document.createElement("table");
    tabla.classList.add("table-container"); // Agregar la clase de los estilos CSS

    tabla.innerHTML = `
        <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Marca</th>
            <th>Categoría</th>
            <th>Color</th>
            <th>Dimensión</th>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Acciones</th>
        </tr>
        <tr class="spacer-row"></tr> <!-- Fila vacía para separación -->
    `;

    productos.forEach(producto => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>${producto.marca}</td>
            <td>${producto.categoria}</td>
            <td>${producto.color}</td>
            <td>${producto.dimension}</td>
            <td>${producto.descripcion}</td>
            <td>${producto.cantidad}</td>
        `;
    
        const columnaAcciones = document.createElement("td");
        columnaAcciones.classList.add("action-buttons");
    
        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.classList.add("btn-eliminar");
        botonEliminar.onclick = () => eliminarProducto(producto.id);
        columnaAcciones.appendChild(botonEliminar);
    
        const botonModificar = document.createElement("button");
        botonModificar.textContent = "Modificar";
        botonModificar.classList.add("btn-modificar");
        botonModificar.onclick = () => toggleFormularioModificar(producto.id);
        columnaAcciones.appendChild(botonModificar);
    
        const botonSalida = document.createElement("button");
        botonSalida.textContent = "Salida";
        botonSalida.classList.add("btn-salida");
        botonSalida.onclick = () => toggleFormularioSalida(producto.id);
        columnaAcciones.appendChild(botonSalida);
    
        fila.appendChild(columnaAcciones);
        tabla.appendChild(fila);
    
        // Formulario de modificación con un id de cantidad único
        const filaModificar = document.createElement("tr");
        filaModificar.id = `formulario-modificar-${producto.id}`;
        filaModificar.style.display = "none";
        filaModificar.innerHTML = `
            <td colspan="9">
                <div class="formulario-modificar">
                    <label>Nombre: <input id="nombre-${producto.id}" value="${producto.nombre}"></label>
                    <label>Marca: <input id="marca-${producto.id}" value="${producto.marca}"></label>
                    <label>Categoría: <input id="categoria-${producto.id}" value="${producto.categoria}"></label>
                    <label>Color: <input id="color-${producto.id}" value="${producto.color}"></label>
                    <label>Dimensión: <input id="dimension-${producto.id}" value="${producto.dimension}"></label>
                    <label>Descripción: <input id="descripcion-${producto.id}" value="${producto.descripcion}"></label>
                    <label>Cantidad: <input id="modificar-cantidad-${producto.id}" type="number" value="${producto.cantidad}"></label>
                    <button onclick="guardarCambios(${producto.id})">Guardar Cambios</button>
                    <button onclick="toggleFormularioModificar(${producto.id})">Cancelar</button>
                </div>
            </td>
        `;
        tabla.appendChild(filaModificar);
    
        // Formulario de salida con un id de cantidad único
        const filaSalida = document.createElement("tr");
        filaSalida.id = `formulario-salida-${producto.id}`;
        filaSalida.style.display = "none";
        filaSalida.innerHTML = `
            <td colspan="9">
                <div class="formulario-salida">
                    <label>Nombre Encargado: <input id="encargado-${producto.id}" type="text" required></label>
                    <label>Nombre Solicitante: <input id="solicitante-${producto.id}" type="text" required></label>
                    <label>Producto: <input type="text" value="${producto.nombre}" disabled></label>
                    <label>Cantidad: <input id="salida-cantidad-${producto.id}" type="number" min="1" required></label>
                    <label>Categoría: <input type="text" value="${producto.categoria}" disabled></label>
                    <input type="hidden" id="productoId-${producto.id}" value="${producto.id}">
                    <button onclick="registrarSalida(${producto.id}, '${producto.nombre}', '${producto.categoria}')">Registrar Salida</button>
                    <button onclick="toggleFormularioSalida(${producto.id})">Cancelar</button>
                </div>
            </td>
        `;
        tabla.appendChild(filaSalida);
    });

    const lista = document.getElementById("lista-productos");
    lista.innerHTML = '';
    lista.appendChild(tabla);
}

function toggleFormularioModificar(id) {
    const filaModificar = document.getElementById(`formulario-modificar-${id}`);
    if (filaModificar.style.display === "none") {
        filaModificar.style.display = "table-row";
    } else {
        filaModificar.style.display = "none";
    }
}
function toggleFormularioSalida(id) {
    const filaSalida = document.getElementById(`formulario-salida-${id}`);
    if (filaSalida.style.display === "none") {
        filaSalida.style.display = "table-row";
    } else {
        filaSalida.style.display = "none";
    }
}

async function registrarSalida(id, nombreProducto, categoria) {
    const nombreEncargado = document.getElementById(`encargado-${id}`).value;
    const nombreSolicitante = document.getElementById(`solicitante-${id}`).value;
    const cantidadInput = document.getElementById(`salida-cantidad-${id}`).value;
    const cantidad = parseInt(cantidadInput, 10); // Convertimos el valor a número entero

    console.log("Datos de salida:");
    console.log(`Producto ID: ${id}`);
    console.log(`Nombre Encargado: ${nombreEncargado}`);
    console.log(`Nombre Solicitante: ${nombreSolicitante}`);
    console.log(`Cantidad de Salida Ingresada: ${cantidad}`);

    if (isNaN(cantidad) || cantidad <= 0) {
        alert("Por favor, ingrese una cantidad válida.");
        return;
    }
     if (!nombreEncargado || !nombreSolicitante || !cantidadInput) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    const data = {
        nombreEncargado,
        nombreSolicitante,
        producto: nombreProducto,
        productoId: id,
        cantidadp: cantidad,
        categoria
    };

    console.log("Datos finales enviados para registrar salida:", JSON.stringify(data));

    try {
        const response = await fetch('http://localhost:8080/salida', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert("Salida registrada con éxito");
            obtenerProductos(); // Refresca la lista de productos
        } else {
            const errorData = await response.json();
            alert(`Error al registrar la salida: ${errorData.message}`);
        }
    } catch (error) {
        console.error("Error al conectar con la API:", error);
        alert("Error al conectar con la API");
    }
}

async function guardarCambios(id) {
    const nombre = document.getElementById(`nombre-${id}`).value;
    const marca = document.getElementById(`marca-${id}`).value;
    const categoria = document.getElementById(`categoria-${id}`).value;
    const color = document.getElementById(`color-${id}`).value;
    const dimension = document.getElementById(`dimension-${id}`).value;
    const descripcion = document.getElementById(`descripcion-${id}`).value;
    const cantidad = parseInt(document.getElementById(`modificar-cantidad-${id}`).value);

    console.log("Datos para modificar:", { nombre, marca, categoria, color, dimension, descripcion, cantidad });

    if (isNaN(cantidad) || cantidad < 0) {
        alert("Por favor, ingrese una cantidad válida.");
        return;
    }

    const data = {
        nombre,
        marca,
        categoria,
        color,
        dimension,
        descripcion,
        cantidad
    };

    try {
        const response = await fetch(`http://localhost:8080/${id}`, {
            method: 'PUT', // Asegúrate de que el endpoint en el backend esté configurado para aceptar PUT
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert("Producto modificado con éxito");
            obtenerProductos(); // Recarga la lista de productos para reflejar los cambios
        } else {
            const errorData = await response.json();
            alert(`Error al modificar el producto: ${errorData.message}`);
        }
    } catch (error) {
        console.error("Error al conectar con la API:", error);
        alert("Error al conectar con la API");
    }
}

async function eliminarProducto(id) {
    const confirmacion = confirm("¿Estás seguro de que deseas eliminar este producto?");
    
    if (confirmacion) {
        try {
            const response = await fetch(`http://localhost:8080/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                alert("Producto eliminado exitosamente");
                obtenerProductos(); // Actualizar la lista de productos
            } else {
                alert("Error al eliminar el producto");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error al conectar con la API");
        }
    } else {
        alert("Eliminación cancelada");
    }
}

function modificarProducto(producto) {
    // Mostrar el modal
    const modal = document.getElementById("modalProducto");
    modal.style.display = "flex";  // Mostrar el modal como un flexbox para centrarlo

    // Rellenar el formulario en el modal con los datos del producto
    document.getElementById("idProductoModal").value = producto.id;
    document.getElementById("NProductoModal").value = producto.nombre;
    document.getElementById("marcaModal").value = producto.marca;
    document.getElementById("categoriaModal").value = producto.categoria;
    document.getElementById("colorModal").value = producto.color;
    document.getElementById("dimensionModal").value = producto.dimension;
    document.getElementById("itemDetailsDescriptionModal").value = producto.descripcion;
    document.getElementById("cantidadModal").value = producto.cantidad;

    // Cambiar el botón "Agregar" a "Actualizar"
    const btnActualizar = document.querySelector(".btn-actualizar");

    // Limpiar el evento anterior del botón para evitar duplicación de eventos
    btnActualizar.onclick = function () {
        actualizarProducto(producto.id);
    };

    // Cerrar el modal al presionar la 'X'
    document.querySelector(".close").onclick = function() {
        modal.style.display = "none";
    };

    // Cerrar el modal si el usuario hace clic fuera del contenido
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}

// Función para actualizar el producto usando una solicitud PUT a la API
async function actualizarProducto(id) {
    // Obtener los nuevos datos del formulario en el modal
    const productoActualizado = {
        id: id,
        nombre: document.getElementById("NProductoModal").value,
        marca: document.getElementById("marcaModal").value,
        categoria: document.getElementById("categoriaModal").value,
        color: document.getElementById("colorModal").value,
        dimension: document.getElementById("dimensionModal").value,
        descripcion: document.getElementById("itemDetailsDescriptionModal").value,
        cantidad: parseInt(document.getElementById("cantidadModal").value),
    };

    try {
        // Hacer la solicitud PUT a la API para actualizar el producto
        const response = await fetch('http://localhost:8080/${id}', {
            method: "PUT",
            headers: {
             
                "Content-Type": "application/json",
            },
            body: JSON.stringify(productoActualizado),
        });

        if (response.ok) {
            alert("Producto actualizado exitosamente");

            // Cerrar el modal después de la actualización
            const modal = document.getElementById("modalProducto");
            modal.style.display = "none";

            // Limpiar el formulario del modal
            document.getElementById("modalForm").reset();

            // Actualizar la lista de productos en la vista
            obtenerProductos();
        } else {
            alert("Error al actualizar el producto");
        }
    } 
    catch (error) {
        console.error("Error:", error);
        alert("Error al conectar con la API");
    }
}

function buscarProducto() {
     const terminoBusqueda = document.getElementById("campoBusqueda").value.trim().toLowerCase();

    // Verificar si el campo de búsqueda está vacío
    if (!terminoBusqueda) {
        const contenedorResultados = document.getElementById("resultados-busqueda");
        contenedorResultados.innerHTML = '<p>Por favor, ingrese un término de búsqueda.</p>';
        return;
    }

    // Buscar coincidencia exacta por nombre o id
    const productoExacto = productosGlobal.find(producto => 
        producto.nombre.toLowerCase() === terminoBusqueda || producto.id.toString() === terminoBusqueda
    );

    // Buscar coincidencias parciales por nombre o id
    const productosSimilares = productosGlobal.filter(producto => 
        (producto.nombre.toLowerCase().includes(terminoBusqueda) || producto.id.toString().includes(terminoBusqueda)) 
        && producto !== productoExacto
    );

    // Combinar resultados (si hay coincidencia exacta, la pone primero)
    const resultados = [];
    if (productoExacto) resultados.push(productoExacto);
    resultados.push(...productosSimilares);

    if (resultados.length > 0) {
        mostrarListaProductos(resultados); // Muestra los productos encontrados
    } else {
        const contenedorResultados = document.getElementById("resultados-busqueda");
        contenedorResultados.innerHTML = '<p>No se encontraron productos.</p>';
    }
}

function mostrarListaProductos(productos) { 
    const contenedorResultados = document.getElementById("resultados-busqueda");
    contenedorResultados.style.display = "block"; 
    contenedorResultados.innerHTML = ''; // Limpiar resultados previos

    if (productos.length === 0) {
        contenedorResultados.innerHTML = '<p>No se encontraron productos.</p>';
        return;
    }

    // Crear la tabla
    const tabla = document.createElement("table");
    tabla.classList.add("tabla-productos");

    // Crear la fila de encabezado
    const encabezado = `
        <thead>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Marca</th>
                <th>Categoría</th>
                <th>Color</th>
                <th>Dimensión</th>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Acciones</th>
            </tr>
        </thead>
    `;
    tabla.innerHTML = encabezado;

    // Crear el cuerpo de la tabla
    const cuerpo = document.createElement("tbody");
    productos.forEach(producto => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>${producto.marca}</td>
            <td>${producto.categoria}</td>
            <td>${producto.color}</td>
            <td>${producto.dimension}</td>
            <td>${producto.descripcion}</td>
            <td>${producto.cantidad}</td>
        `;

        // Crear las celdas para los botones de acción
        const celdaAcciones = document.createElement("td");

        // Botón de Eliminar
        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.classList.add("btn-eliminar");
        botonEliminar.onclick = () => eliminarProducto(producto.id);

        // Botón de Modificar
        const botonModificar = document.createElement("button");
        botonModificar.textContent = "Modificar";
        botonModificar.classList.add("btn-modificar");
        botonModificar.onclick = () => toggleFormularioModificar(producto.id);

        // Botón de Salida
        const botonSalida = document.createElement("button");
        botonSalida.textContent = "Salida";
        botonSalida.classList.add("btn-salida");
        botonSalida.onclick = () => toggleFormularioSalida(producto.id);

        // Añadir los botones a la celda de acciones
        celdaAcciones.appendChild(botonEliminar);
        celdaAcciones.appendChild(botonModificar);
        celdaAcciones.appendChild(botonSalida);
        fila.appendChild(celdaAcciones);

        cuerpo.appendChild(fila);

        // Crear una fila adicional para el formulario de modificación
        const filaModificar = document.createElement("tr");
        filaModificar.id = `formulario-modificar-${producto.id}`;
        filaModificar.style.display = "none"; // Ocultar por defecto
        filaModificar.innerHTML = `
            <td colspan="9">
                <div class="formulario-modificar">
                    <label>Nombre: <input id="nombre-${producto.id}" value="${producto.nombre}"></label>
                    <label>Marca: <input id="marca-${producto.id}" value="${producto.marca}"></label>
                    <label>Categoría: <input id="categoria-${producto.id}" value="${producto.categoria}"></label>
                    <label>Color: <input id="color-${producto.id}" value="${producto.color}"></label>
                    <label>Dimensión: <input id="dimension-${producto.id}" value="${producto.dimension}"></label>
                    <label>Descripción: <input id="descripcion-${producto.id}" value="${producto.descripcion}"></label>
                    <label>Cantidad: <input id="modificar-cantidad-${producto.id}" type="number" value="${producto.cantidad}"></label>
                    <button onclick="guardarCambios(${producto.id})">Guardar Cambios</button>
                    <button onclick="toggleFormularioModificar(${producto.id})">Cancelar</button>
                </div>
            </td>
        `;
        cuerpo.appendChild(filaModificar);

        // Crear una fila adicional para el formulario de salida
        const filaSalida = document.createElement("tr");
        filaSalida.id = `formulario-salida-${producto.id}`;
        filaSalida.style.display = "none"; // Ocultar por defecto
        filaSalida.innerHTML = `
            <td colspan="9">
                <div class="formulario-salida">
                    <label>Nombre Encargado: <input id="encargado-${producto.id}" type="text" required></label>
                    <label>Nombre Solicitante: <input id="solicitante-${producto.id}" type="text" required></label>
                    <label>Producto: <input type="text" value="${producto.nombre}" disabled></label>
                    <label>Cantidad: <input id="salida-cantidad-${producto.id}" type="number" min="1" required></label>
                    <label>Categoría: <input type="text" value="${producto.categoria}" disabled></label>
                    <input type="hidden" id="productoId-${producto.id}" value="${producto.id}">
                    <button onclick="registrarSalida(${producto.id}, '${producto.nombre}', '${producto.categoria}')">Registrar Salida</button>
                    <button onclick="toggleFormularioSalida(${producto.id})">Cancelar</button>
                </div>
            </td>
        `;
        cuerpo.appendChild(filaSalida); // Agregar la fila del formulario de salida al cuerpo de la tabla
    });

    tabla.appendChild(cuerpo);

    // Crear el botón "Listo"
    const botonListo = document.createElement("button");
    botonListo.textContent = "Listo";
    botonListo.classList.add("btn-listo");
    botonListo.onclick = () => {
        contenedorResultados.style.display = "none"; // Ocultar los resultados
    };

    contenedorResultados.appendChild(tabla);
    contenedorResultados.appendChild(botonListo);
}





document.addEventListener('DOMContentLoaded', function () {
    // Definir la función que actualiza la tabla
    function actualizarTabla() {
        // Llamada a la API para obtener los datos
        fetch('http://localhost:8080/his')
            .then(response => response.json())
            .then(data => {
                const tablaSalidas = document.getElementById('tablaSalidas').getElementsByTagName('tbody')[0];

                // Limpia la tabla antes de agregar nuevas filas
                tablaSalidas.innerHTML = '';

                data.forEach(salida => {
                    const nuevaFila = tablaSalidas.insertRow();

                    let celdaId = nuevaFila.insertCell(0);
                    let celdaEncargado = nuevaFila.insertCell(1);
                    let celdaSolicitante = nuevaFila.insertCell(2);
                    let celdaFechaHora = nuevaFila.insertCell(3);
                    let celdaProducto = nuevaFila.insertCell(4);
                    let celdaCantidadp = nuevaFila.insertCell(5); // Cambiado a cantidadp
                    let celdaCategoria = nuevaFila.insertCell(6);

                    celdaId.innerText = salida.id;
                    celdaEncargado.innerText = salida.nombreEncargado;
                    celdaSolicitante.innerText = salida.nombreSolicitante;
                    celdaFechaHora.innerText = salida.fechaHoraSalida;
                    celdaProducto.innerText = salida.productoId;
                    celdaCantidadp.innerText = salida.cantidadp; // Cambiado a cantidadp
                    celdaCategoria.innerText = salida.categoria;
                });
            })
            .catch(error => console.error('Error al obtener los datos:', error));
    }

    // Llamar a actualizarTabla inicialmente
    actualizarTabla();

    // Configurar el intervalo para actualizar cada 5 segundos (5000 ms)
    setInterval(actualizarTabla, 5000);
});

// Función para descargar la tabla como PDF
function descargarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("Historial de Salidas de Productos", 10, 10);
    
    let tabla = document.getElementById("tablaSalidas");
    let filas = [...tabla.rows].map(row => [...row.cells].map(cell => cell.innerText));

    filas.forEach((fila, i) => {
        fila.forEach((celda, j) => {
            doc.text(celda, 10 + j * 30, 20 + i * 10);
        });
    });

    doc.save("Historial_Salidas.pdf");
}

// Función para descargar la tabla como archivo de Word
function descargarWord() {
    const tabla = document.getElementById("tablaSalidas").outerHTML;
    const contenido = `
      <html>
        <head><meta charset="UTF-8"></head>
        <body>
          <h2>Historial de Salidas de Productos</h2>
          ${tabla}
        </body>
      </html>`;
    
    const blob = new Blob(['\ufeff', contenido], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = 'Historial_Salidas.doc';
    a.click();
    URL.revokeObjectURL(url);
}

// Función para descargar la tabla como archivo Excel
function descargarExcel() {
    const tabla = document.getElementById("tablaSalidas");
    const filas = [...tabla.rows].map(row => [...row.cells].map(cell => cell.innerText));
    
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(filas);

    XLSX.utils.book_append_sheet(wb, ws, "Historial de Salidas");
    XLSX.writeFile(wb, "Historial_Salidas.xlsx");
}


function cambiarContenido(id) {
    // Oculta todos los contenedores
    document.querySelectorAll('.content').forEach((element) => {
        element.style.display = 'none';
    });

    // Muestra el contenedor específico
    const contenedor = document.getElementById(id);
    if (contenedor) {
        contenedor.style.display = 'block';
    }
}

// Cierra el contenedor al hacer clic fuera de él
document.addEventListener('click', (event) => {
    const contenedor = document.getElementById('container-5');
    const enlaceHistorial = document.querySelector('.sidebar-link');

    if (contenedor && contenedor.style.display === 'block') {
        // Verifica si el clic ocurrió fuera del contenedor o del enlace
        if (!contenedor.contains(event.target) && !enlaceHistorial.contains(event.target)) {
            contenedor.style.display = 'none';
        }
    }
});





function logout() {
    // Si tienes una API para cerrar sesión, llama a esa API aquí
    // Por ejemplo: 
    // fetch('/api/logout', { method: 'POST' })

    // Borra el almacenamiento local y la sesión
    sessionStorage.clear();
    localStorage.clear();

    // Redirige al usuario a la página de login
    window.location.href = 'login.html';
}

// Detecta si el usuario intenta ir atrás en el navegador
function preventBack() {
    window.history.forward();
}

// Configura el evento al cargar la página
window.onload = function() {
    preventBack();
    window.onunload = function() { null }; // Para navegadores más antiguos
};

// Agrega el evento al enlace "Salir"
document.querySelector('.sidebar-link').addEventListener('click', (event) => {
    event.preventDefault();
    logout();
});





// Llamar a obtenerProductos para cargar la lista al inicio
document.addEventListener("DOMContentLoaded", obtenerProductos);