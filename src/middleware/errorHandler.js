exports.noEncontrado = (req, res) => {
  res.status(404).json({ mensaje: `Ruta no encontrada: ${req.originalUrl}` });
};

exports.manejarErrores = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const mensajes = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ mensaje: mensajes.join(', ') });
  }
  console.error(err);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
};