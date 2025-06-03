// src/services/user.service.js
const Rol = require("../models/rol.model");
const { Usuario } = require("../models"); //añadido recien

async function getUserRoles(userId) {
  const user = await Usuario.findByPk(userId, {
    include: {
      model: Rol,
      //as: "Rols", //recien meti esto che
      through: { attributes: [] },
    },
  });
  if (!user) throw new Error("Usuario no encontrado.");
  return user.Rols.map((r) => r.id_rol);
}

async function setUserRoles(userId, roles = []) {
  const user = await Usuario.findByPk(userId);
  if (!user) throw new Error("Usuario no encontrado.");

  // Buscar los roles válidos en la tabla rol
  const rolRecords = await Rol.findAll({ where: { id_rol: roles } });
  // Reemplaza todos los roles del usuario con los nuevos
  await user.setRols(rolRecords);
  return rolRecords.map((r) => r.id_rol);
}

async function updateUserData(userId, userData) {
  // Verificar que el usuario existe
  const usuario = await Usuario.findByPk(userId);
  if (!usuario) throw new Error("Usuario no encontrado");

  // Campos que pueden actualizarse
  const actualizables = [
    "nombre",
    "apellido",
    "correo",
    "telefono",
    "calle",
    "ciudad",
    "codigo_postal",
    "estado_usuario",
  ];

  // Filtrar solo los campos permitidos
  const datosActualizados = {};
  actualizables.forEach((campo) => {
    if (userData[campo] !== undefined) {
      datosActualizados[campo] = userData[campo];
    }
  });

  // Si incluye id_rol, verificar que el rol existe
  if (userData.id_rol) {
    const rol = await Rol.findByPk(userData.id_rol);
    if (!rol) throw new Error("Rol no encontrado");
    datosActualizados.id_rol = userData.id_rol;
  }

  // Actualizar el usuario
  await usuario.update(datosActualizados);

  // Devolver el usuario actualizado (sin incluir password_hash)
  const usuarioActualizado = await Usuario.findByPk(userId, {
    attributes: { exclude: ["password_hash"] },
    include: [{ model: Rol, as: "rol" }],
  });

  return usuarioActualizado;
}

module.exports = { getUserRoles, setUserRoles, updateUserData };
