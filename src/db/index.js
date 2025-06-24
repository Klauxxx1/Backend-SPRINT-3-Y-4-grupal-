// src/db/index.js
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS } = process.env;

// Ruta al certificado CA
const caCertPath = path.join(__dirname, "ca-certificate.crt");
const caCert = fs.readFileSync(caCertPath).toString();

// String de conexión
const connectionString = `postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=require`;

// Instancia de Sequelize con configuración completa
const sequelize = new Sequelize(connectionString, {
  dialect: "postgres",
  logging: false,
  timezone: "-04:00", // Ajuste para la zona horaria
  dialectOptions: {
    useUTC: false, // Evitar conversión a UTC
    prependSearchPath: true,
    ssl: {
      require: true,
      ca: caCert, // Usar el certificado CA
      rejectUnauthorized: false, // Añadir esta línea - Acepta certificados no verificados
    },
  },
  define: {
    schema: "public",
  },
});

// Logs de diagnóstico
console.log("Configuración de conexión a la base de datos:");
console.log(`- Host: ${DB_HOST}`);
console.log(`- Puerto: ${DB_PORT}`);
console.log(`- Base de datos: ${DB_NAME}`);
console.log(`- Usuario: ${DB_USER}`);
console.log(
  `- Certificado CA: ${caCertPath} (${
    fs.existsSync(caCertPath) ? "Encontrado" : "No encontrado!"
  })`
);

module.exports = sequelize;
