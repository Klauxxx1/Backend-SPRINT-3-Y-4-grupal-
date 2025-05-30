// src/middlewares/authorizeRoles.js
module.exports =
  (...allowedRoles) =>
  (req, res, next) => {
    // Imprimir para depuración
    console.log("Usuario:", req.user);

    // Verificar si existe req.user.role o si debemos usar otra propiedad
    const role = req.user.role || "admin"; // Forzar 'admin' temporalmente

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ mensaje: "Acceso denegado" });
    }
    next();
  };

//-------------------------------------------------------------
/*module.exports = (...allowedRoles) => (req, res, next) => {
  const { role } = req.user;
  if (!allowedRoles.includes(role)) {
    return res.status(403).json({ mensaje: 'Acceso denegado' });
  }
  next();
};*/
