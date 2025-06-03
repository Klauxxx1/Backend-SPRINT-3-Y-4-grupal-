// src/models/audiencia.model.js
const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Audiencia = sequelize.define(
  "Audiencia",
  {
    id_audiencia: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_expediente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "expediente",
        key: "id_expediente",
      },
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    duracion: {
      type: DataTypes.STRING, // almacena el intervalo como texto
      allowNull: true,
    },
    ubicacion: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    estado: {
      type: DataTypes.ENUM("Pendiente", "Realizada", "Cancelada"),
      allowNull: false,
      defaultValue: "Pendiente",
    },
    observacion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "audiencia",
    timestamps: false,
  }
);

module.exports = { Audiencia };
