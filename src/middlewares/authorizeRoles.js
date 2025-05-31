// src/middlewares/authorizeRoles.js
module.exports =
  (...allowedRoles) =>
  (req, res, next) => {
    // Imprimir para depuración
    console.log("Usuario:", req.user);
    console.log("Roles permitidos:", allowedRoles);

    //MODIFIQUE PARA QUE PIDA RESTRICCION DE ESTE ARCHIVO
    return next();
    // Verificar si existe req.user.role o si debemos usar otra propiedad
    /*const role = req.user.role || "admin"; 

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ mensaje: "Acceso denegado" });
    }
    next();
  };*/
  };

//-------------------------------------------------------------
/*module.exports = (...allowedRoles) => (req, res, next) => {
  const { role } = req.user;
  if (!allowedRoles.includes(role)) {
    return res.status(403).json({ mensaje: 'Acceso denegado' });
  }
  next();
};*/
