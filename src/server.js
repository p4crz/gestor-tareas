require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { noEncontrado, manejarErrores } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.get('/', (req, res) => res.redirect('/login.html'));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, mensaje: 'Servidor funcionando' });
});

app.use('/api/auth', authRoutes);
app.use('/api/tareas', taskRoutes);

// Siempre al final
app.use('/api', noEncontrado);
app.use(manejarErrores);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB conectado');
    app.listen(process.env.PORT, () =>
      console.log(`Servidor en http://localhost:${process.env.PORT}`)
    );
  })
  .catch((err) => console.error('Error de conexión:', err.message));