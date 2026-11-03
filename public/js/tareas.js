const token = localStorage.getItem('token');
if (!token) window.location.href = 'login.html';

const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
document.getElementById('nombreUsuario').textContent = `Hola, ${usuario.nombre || ''}`;

const lista = document.getElementById('listaTareas');
const form = document.getElementById('formTarea');
const inputTitulo = document.getElementById('titulo');
const inputDescripcion = document.getElementById('descripcion');
const mensaje = document.getElementById('mensaje');
const btnGuardar = document.getElementById('btnGuardar');
const tituloForm = document.getElementById('tituloForm');

let idEditando = null;

const cabeceras = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
};

function mostrarMensaje(texto) {
  mensaje.textContent = texto;
  mensaje.className = 'mensaje error';
}

// Si el token venció o es inválido, volver al login
function revisarSesion(respuesta) {
  if (respuesta.status === 401) {
    localStorage.clear();
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

// READ: cargar y mostrar tareas
async function cargarTareas() {
  const respuesta = await fetch('/api/tareas', { headers: cabeceras });
  if (!revisarSesion(respuesta)) return;
  const tareas = await respuesta.json();

  lista.innerHTML = '';
  if (tareas.length === 0) {
    lista.innerHTML = '<p class="vacio">Aún no tienes tareas. ¡Agrega la primera!</p>';
    return;
  }

  tareas.forEach((t) => {
    const div = document.createElement('div');
    div.className = 'tarea' + (t.completada ? ' completada' : '');
    div.innerHTML = `
      <input type="checkbox" ${t.completada ? 'checked' : ''}>
      <div class="info">
        <h3></h3>
        <p></p>
      </div>
      <button class="btn-editar">Editar</button>
      <button class="btn-borrar">Borrar</button>
    `;
    div.querySelector('h3').textContent = t.titulo;
    div.querySelector('p').textContent = t.descripcion;

    div.querySelector('input').addEventListener('change', (e) =>
      actualizar(t._id, { titulo: t.titulo, descripcion: t.descripcion, completada: e.target.checked })
    );
    div.querySelector('.btn-editar').addEventListener('click', () => empezarEdicion(t));
    div.querySelector('.btn-borrar').addEventListener('click', () => borrar(t._id));

    lista.appendChild(div);
  });
}

// CREATE y UPDATE desde el formulario
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  mensaje.className = 'mensaje oculto';

  const datos = { titulo: inputTitulo.value, descripcion: inputDescripcion.value };

  if (idEditando) {
    await actualizar(idEditando, datos);
    terminarEdicion();
  } else {
    const respuesta = await fetch('/api/tareas', {
      method: 'POST',
      headers: cabeceras,
      body: JSON.stringify(datos),
    });
    if (!revisarSesion(respuesta)) return;
    if (!respuesta.ok) {
      const error = await respuesta.json();
      return mostrarMensaje(error.mensaje);
    }
    form.reset();
    cargarTareas();
  }
});

// UPDATE
async function actualizar(id, datos) {
  const respuesta = await fetch(`/api/tareas/${id}`, {
    method: 'PUT',
    headers: cabeceras,
    body: JSON.stringify(datos),
  });
  if (!revisarSesion(respuesta)) return;
  if (!respuesta.ok) {
    const error = await respuesta.json();
    return mostrarMensaje(error.mensaje);
  }
  cargarTareas();
}

function empezarEdicion(t) {
  idEditando = t._id;
  inputTitulo.value = t.titulo;
  inputDescripcion.value = t.descripcion;
  btnGuardar.textContent = 'Guardar cambios';
  tituloForm.textContent = 'Editar tarea';
  inputTitulo.focus();
}

function terminarEdicion() {
  idEditando = null;
  form.reset();
  btnGuardar.textContent = 'Agregar tarea';
  tituloForm.textContent = 'Nueva tarea';
}

// DELETE
async function borrar(id) {
  if (!confirm('¿Seguro que quieres borrar esta tarea?')) return;
  const respuesta = await fetch(`/api/tareas/${id}`, {
    method: 'DELETE',
    headers: cabeceras,
  });
  if (!revisarSesion(respuesta)) return;
  cargarTareas();
}

// Cerrar sesión
document.getElementById('btnSalir').addEventListener('click', () => {
  localStorage.clear();
  window.location.href = 'login.html';
});

cargarTareas();