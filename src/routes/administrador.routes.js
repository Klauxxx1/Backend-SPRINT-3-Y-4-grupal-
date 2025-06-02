const express = require("express");
const router = express.Router();
const {
  getAdministradores,
  crearAdministrador,
} = require("../controllers/administrador.controller");
const { sequelize } = require("../models");

router.get("/", getAdministradores);
router.post("/", crearAdministrador);
router.post("/asignar-rol", async (req, res) => {
  try {
    const { userId, rol } = req.body;
    // Insertar directamente usando SQL
    await sequelize.query(
      `INSERT INTO usuario_rol (id_usuario, id_rol) VALUES (:userId, :rolId)`,
      {
        replacements: { userId, rolId: rol },
        type: sequelize.QueryTypes.INSERT,
      }
    );
    res.json({ mensaje: `Rol ${rol} asignado al usuario ${userId}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
