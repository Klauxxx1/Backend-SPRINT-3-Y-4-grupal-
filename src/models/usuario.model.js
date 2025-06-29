// src/models/usuario.model.js
const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Usuario = sequelize.define(
  "Usuario",
  {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    tokenfcm: {
      type: DataTypes.STRING(255),
      allowNull: true, // Permitir nulo para usuarios sin token
      defaultValue: null, // Valor por defecto si no se proporciona
    },
    apellido: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    correo: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },
    password_hash: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    telefono: DataTypes.STRING(20),
    calle: DataTypes.STRING(150),
    ciudad: DataTypes.STRING(100),
    codigo_postal: DataTypes.STRING(20),
    estado_usuario: {
      type: DataTypes.ENUM("Activo", "Inactivo"),
      allowNull: false,
      defaultValue: "Activo",
    },
    fecha_registro: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    id_rol: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: "rol", // Nombre de la tabla relacionada
        key: "id_rol", // Clave primaria de la tabla relacionada
      },
    },
  },
  {
    tableName: "usuario",
    timestamps: false,
  }
);

module.exports = Usuario;
