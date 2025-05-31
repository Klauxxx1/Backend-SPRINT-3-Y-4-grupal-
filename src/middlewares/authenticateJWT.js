// src/middlewares/authenticateJWT.js
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

/*module.exports = function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ mensaje: "Token no provisto" });
  }
  const token = authHeader.split(" ")[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ mensaje: "Token inválido" });
  }
};*/

// Middleware de autenticación desactivado temporalmente
module.exports = (req, res, next) => {
  console.log(
    "AVISO: Autenticación JWT desactivada - todas las rutas son públicas"
  );

  // Si hay un token, aún lo procesa pero no bloquea si no existe
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      const jwt = require("jsonwebtoken");
      const { JWT_SECRET } = process.env;
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch (error) {
      console.log("Token inválido pero permitiendo acceso igualmente");
    }
  }

  // Siempre permite el acceso
  next();
};
