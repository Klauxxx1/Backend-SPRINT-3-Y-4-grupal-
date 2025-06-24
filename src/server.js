// Añadir como primera línea en server.js
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // Solo para desarrollo

const dotenv = require("dotenv");
const path = require("path");

require("dotenv").config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});
// Cargar el archivo .env apropiado según NODE_ENV
const envFile =
  process.env.NODE_ENV === "production" ? ".env.production" : ".env.local";
dotenv.config({ path: path.resolve(__dirname, "..", envFile) });

const app = require("./utils/app");
const sequelize = require("./db");

const PORT = Number(process.env.PORT) || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a la BD establecida.");

    // Importar los modelos explícitamente para controlar el orden
    const models = require("./models");

    // 1. Sincronizar primero el modelo Rol
    await models.Rol.sync({ alter: true });
    console.log("✅ Tabla Rol sincronizada");

    // 2. Sincronizar modelos que dependen de Rol
    await models.Usuario.sync({ alter: true });
    console.log("✅ Tabla Usuario sincronizada");

    // 3. Sincronizar el resto de modelos
    const remainingModels = Object.values(models).filter(
      (model) => model.name !== "Rol" && model.name !== "Usuario"
    );

    for (const model of remainingModels) {
      await model.sync({ alter: true });
      console.log(`✅ Tabla ${model.name} sincronizada`);
    }

    console.log("✅ Todas las tablas sincronizadas correctamente");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ No se pudo conectar a la BD o sincronizar tablas:", err);
    process.exit(1);
  }
})();
