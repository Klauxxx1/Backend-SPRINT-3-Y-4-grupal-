// filepath: d:\MarioUniv\9no\Klaus\Grupal\Backend-SPRINT-3-Y-4-grupal-\src\services\push-notification.service.js
const admin = require("../config/firebase");

async function enviarNotificacionPush(token, titulo, cuerpo, datos = {}) {
  try {
    if (!token) {
      console.log(
        "No se puede enviar notificación: Token FCM no proporcionado"
      );
      return null;
    }

    const mensaje = {
      notification: {
        title: titulo,
        body: cuerpo,
      },
      data: datos,
      token: token,
    };

    const respuesta = await admin.messaging().send(mensaje);
    console.log("Notificación push enviada:", respuesta);
    return respuesta;
  } catch (error) {
    console.error("Error al enviar notificación push:", error);
    return null; // No interrumpir el flujo si falla
  }
}

module.exports = {
  enviarNotificacionPush,
};
