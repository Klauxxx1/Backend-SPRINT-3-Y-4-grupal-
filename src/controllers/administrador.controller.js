// src/controllers/administrador.controller.js
const service = require("../services/administrador.service");
const bcrypt = require("bcryptjs");

async function getAdministradores(req, res) {
  try {
    const rows = await service.listAdministradores();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
}

async function crearAdministrador(req, res) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const data = {
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      correo: req.body.correo,
      password_hash: hash, // hazhearlo antes o aquí
      telefono: req.body.telefono,
      calle: req.body.calle,
      ciudad: req.body.ciudad,
      codigo_postal: req.body.codigo_postal,
    };
    const admin = await service.createAdministrador(data);
    res
      .status(201)
      .json({ mensaje: "Administrador creado correctamente", admin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
}

module.exports = {
  getAdministradores,
  crearAdministrador,
};
