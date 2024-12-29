const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Ruta de login
router.post('/login', authController.login);
router.post("/logout", (req, res) => {
    res.clearCookie("token", {
      path: "/", 
      httpOnly: true, 
      secure: true, // Solo si usas HTTPS
      sameSite: "lax", // Establecer la misma sesión para todos los navegadores
    });
    res.status(200).json({ message: "Sesión cerrada correctamente" });
}); 

module.exports = router;