const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: [true, 'El título es obligatorio'], trim: true },
    descripcion: { type: String, trim: true, default: '' },
    completada: { type: Boolean, default: false },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);