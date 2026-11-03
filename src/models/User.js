const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: [true, 'El nombre es obligatorio'], trim: true },
    email: {
      type: String,
      required: [true, 'El correo es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    },
  },
  { timestamps: true }
);

// Antes de guardar, encripta la contraseña
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compara la contraseña escrita con la encriptada
userSchema.methods.compararPassword = function (passwordEscrita) {
  return bcrypt.compare(passwordEscrita, this.password);
};

module.exports = mongoose.model('User', userSchema);