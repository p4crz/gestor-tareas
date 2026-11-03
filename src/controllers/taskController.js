const Task = require('../models/Task');

// READ: listar las tareas del usuario
exports.obtenerTareas = async (req, res, next) => {
  try {
    const tareas = await Task.find({ usuario: req.userId }).sort({ createdAt: -1 });
    res.json(tareas);
  } catch (err) {
    next(err);
  }
};

// READ: obtener una sola tarea
exports.obtenerTarea = async (req, res, next) => {
  try {
    const tarea = await Task.findOne({ _id: req.params.id, usuario: req.userId });
    if (!tarea) {
      return res.status(404).json({ mensaje: 'Tarea no encontrada' });
    }
    res.json(tarea);
  } catch (err) {
    next(err);
  }
};

// CREATE: crear una tarea
exports.crearTarea = async (req, res, next) => {
  try {
    const { titulo, descripcion } = req.body;
    const tarea = await Task.create({ titulo, descripcion, usuario: req.userId });
    res.status(201).json(tarea);
  } catch (err) {
    next(err);
  }
};

// UPDATE: editar una tarea
exports.actualizarTarea = async (req, res, next) => {
  try {
    const { titulo, descripcion, completada } = req.body;
    const tarea = await Task.findOneAndUpdate(
      { _id: req.params.id, usuario: req.userId },
      { titulo, descripcion, completada },
      { new: true, runValidators: true }
    );
    if (!tarea) {
      return res.status(404).json({ mensaje: 'Tarea no encontrada' });
    }
    res.json(tarea);
  } catch (err) {
    next(err);
  }
};

// DELETE: borrar una tarea
exports.eliminarTarea = async (req, res, next) => {
  try {
    const tarea = await Task.findOneAndDelete({ _id: req.params.id, usuario: req.userId });
    if (!tarea) {
      return res.status(404).json({ mensaje: 'Tarea no encontrada' });
    }
    res.json({ mensaje: 'Tarea eliminada' });
  } catch (err) {
    next(err);
  }
};