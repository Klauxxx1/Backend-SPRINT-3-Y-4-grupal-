// src/services/administrador.service.js
const Rol = require("../models/rol.model");
const { Usuario } = require("../models");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt"); // Añadir esta importación

/**
 * Lista todos los usuarios con rol 'administrador'
 */
async function listAdministradores() {
  return Usuario.findAll({
    attributes: ["id_usuario", "nombre", "apellido", "correo", "telefono"],
    include: [
      {
        model: Rol,
        as: "roles",
        where: { id_rol: "administrador" },
        attributes: [],
      },
    ],
  });
}

/**
 * Crea un nuevo usuario y le asigna el rol 'administrador'
 * data debe incluir: nombre, apellido, correo, password, etc.
 */
async function createAdministrador(data) {
  // Hashear la contraseña antes de guardarla
  const hashedData = { ...data };

  if (hashedData.password) {
    // Si recibe la contraseña como "password"
    hashedData.password_hash = await bcrypt.hash(hashedData.password, 10);
    delete hashedData.password; // Eliminar la versión sin hashear
  } else if (
    hashedData.password_hash &&
    !hashedData.password_hash.startsWith("$2b$")
  ) {
    // Si recibe como "password_hash" pero no es un hash BCrypt
    hashedData.password_hash = await bcrypt.hash(hashedData.password_hash, 10);
  }

  const usuario = await Usuario.create(hashedData);
  await usuario.setRols("administrador");
  return usuario;
}

module.exports = {
  listAdministradores,
  createAdministrador,
};
