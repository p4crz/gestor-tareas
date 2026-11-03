const express = require('express');
const auth = require('../middleware/auth');
const {
  obtenerTareas,
  obtenerTarea,
  crearTarea,
  actualizarTarea,
  eliminarTarea,
} = require('../controllers/taskController');

const router = express.Router();

// Todas las rutas de tareas exigen token
router.use(auth);

router.get('/', obtenerTareas);
router.get('/:id', obtenerTarea);
router.post('/', crearTarea);
router.put('/:id', actualizarTarea);
router.delete('/:id', eliminarTarea);

module.exports = router;