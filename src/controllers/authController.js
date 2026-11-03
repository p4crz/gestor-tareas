const jwt = require('jsonwebtoken');
const User = require('../models/User');

const crearToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

exports.registro = async (req, res, next) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }

    const existe = await User.findOne({ email });
    if (existe) {
      return res.status(409).json({ mensaje: 'Ese correo ya está registrado' });
    }

    const user = await User.create({ nombre, email, password });

    res.status(201).json({
      token: crearToken(user._id),
      usuario: { id: user._id, nombre: user.nombre, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ mensaje: 'Correo y contraseña son obligatorios' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.compararPassword(password))) {
      return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
    }

    res.json({
      token: crearToken(user._id),
      usuario: { id: user._id, nombre: user.nombre, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};