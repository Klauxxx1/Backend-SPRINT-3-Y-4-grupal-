const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const AudienciaUsuario = sequelize.define(
  "AudienciaUsuario",
  {
    id_audiencia: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "audiencia",
        key: "id_audiencia",
      },
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "usuario",
        key: "id_usuario",
      },
    },
    cargo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    tableName: "audiencia_usuario",
    timestamps: false,
  }
);

module.exports = { AudienciaUsuario };
