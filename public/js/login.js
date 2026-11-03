const form = document.getElementById('formAuth');
const mensaje = document.getElementById('mensaje');
const campoNombre = document.getElementById('campoNombre');
const linkCambio = document.getElementById('linkCambio');
const textoCambio = document.getElementById('textoCambio');
const subtitulo = document.getElementById('subtitulo');
const btnEnviar = document.getElementById('btnEnviar');

let modoRegistro = false;

// Si ya hay sesión, ir directo a las tareas
if (localStorage.getItem('token')) {
  window.location.href = 'tareas.html';
}

function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = `mensaje ${tipo}`;
}

// Cambiar entre login y registro
linkCambio.addEventListener('click', (e) => {
  e.preventDefault();
  modoRegistro = !modoRegistro;
  campoNombre.classList.toggle('oculto', !modoRegistro);
  btnEnviar.textContent = modoRegistro ? 'Crear cuenta' : 'Iniciar sesión';
  subtitulo.textContent = modoRegistro ? 'Crea tu cuenta' : 'Inicia sesión para continuar';
  textoCambio.textContent = modoRegistro ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?';
  linkCambio.textContent = modoRegistro ? 'Inicia sesión' : 'Regístrate';
  mensaje.className = 'mensaje oculto';
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const datos = {
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
  };
  if (modoRegistro) datos.nombre = document.getElementById('nombre').value;

  const ruta = modoRegistro ? '/api/auth/registro' : '/api/auth/login';

  try {
    const respuesta = await fetch(ruta, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      return mostrarMensaje(resultado.mensaje, 'error');
    }

    localStorage.setItem('token', resultado.token);
    localStorage.setItem('usuario', JSON.stringify(resultado.usuario));
    window.location.href = 'tareas.html';
  } catch (error) {
    mostrarMensaje('No se pudo conectar con el servidor', 'error');
  }
});