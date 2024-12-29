const jwt = require('jsonwebtoken');

const authMiddleware = (role) => (req, res, next) => {
  const token = req.cookies.token
  // const token = req.headers.authorization?.split(' ')[1];  // Obtener el token del header
  if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verificar si el rol del usuario coincide con el rol requerido
    if (role && decoded.role !== role) {
      return res.status(403).json({ message: 'No autorizado para este rol' });
    }

    req.user = decoded; // Asignar los datos del usuario decodificado al request
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token inválido', error: err.message });
  }
};

module.exports = authMiddleware;