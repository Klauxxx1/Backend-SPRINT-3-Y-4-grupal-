// src/controllers/user.controller.js
const userService = require("../services/user.service");

async function getRoles(req, res) {
  try {
    const roles = await userService.getUserRoles(req.params.id);
    res.json({ id_usuario: req.params.id, roles });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

async function updateRoles(req, res) {
  try {
    const roles = await userService.setUserRoles(req.params.id, req.body.roles);
    res.json({ id_usuario: req.params.id, roles });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function updateUsuario(req, res) {
  try {
    const { id } = req.params;
    const userData = req.body;

    // No permitir actualizar directamente el password por esta ruta
    if (userData.password_hash) {
      delete userData.password_hash;
    }

    const usuarioActualizado = await userService.updateUserData(id, userData);

    res.json({
      mensaje: "Usuario actualizado correctamente",
      usuario: usuarioActualizado,
    });
  } catch (err) {
    console.error(err);
    // Determinar el código de estado basado en el error
    let statusCode = 400;
    if (err.message.includes("no encontrado")) statusCode = 404;

    res.status(statusCode).json({ error: err.message });
  }
}

module.exports = { getRoles, updateRoles, updateUsuario };
