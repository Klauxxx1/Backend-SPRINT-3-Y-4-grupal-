// src/db/index.js
const { Sequelize } = require("sequelize");
const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS, DATABASE_URL } =
  process.env;

let sequelize;

if (DATABASE_URL) {
  // Railway
  sequelize = new Sequelize(DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
      prependSearchPath: true,
    },
    define: {
      schema: "public",
    },
  });
} else {
  // Local
  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      prependSearchPath: true,
    },
    define: {
      schema: "public",
    },
    timezone: "-04:00", // Ajusta a tu zona horaria
    dialectOptions: {
      useUTC: false, // Evitar conversión a UTC
    },
  });
}
// Agregar estos logs
console.log("Configuración de conexión a la base de datos:");
console.log(`- Host: ${DB_HOST}`);
console.log(`- Puerto: ${DB_PORT}`);
console.log(`- Base de datos: ${DB_NAME}`);
console.log(`- Usuario: ${DB_USER}`);
module.exports = sequelize;
