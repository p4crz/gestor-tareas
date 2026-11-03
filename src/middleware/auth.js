const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: 'Necesitas iniciar sesión' });
  }

  try {
    const token = header.split(' ')[1];
    const datos = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = datos.id;
    next();
  } catch (err) {
    res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
};