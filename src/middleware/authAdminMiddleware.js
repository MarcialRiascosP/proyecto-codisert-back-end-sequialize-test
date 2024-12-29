const jwt = require('jsonwebtoken');

// Middleware para verificar que el usuario tenga el rol `admin_super`
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  // const token = req.headers.authorization?.split(' ')[1];  // Obtener el token del header
  if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

  try {
    // Decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verificar que el rol del usuario sea exactamente 'admin_super'
    if (decoded.role !== 'admin_super') {
      return res.status(403).json({ message: 'No autorizado para este rol' });
    }

    // Si el rol es el adecuado, asignamos los datos del usuario decodificado a `req.user`
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token inválido', error: err.message });
  }
};

module.exports = authMiddleware;