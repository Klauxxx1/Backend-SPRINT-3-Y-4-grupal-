const { Notificacion } = require("../models");
const { Usuario } = require("../models");
const pushService = require("./push-notification.service");

async function crearNotificacion(id_usuario, mensaje) {
  // Crear notificación en la base de datos
  const notificacion = await Notificacion.create({ id_usuario, mensaje });

  // Buscar al usuario para obtener su token FCM
  const usuario = await Usuario.findByPk(id_usuario);

  // Enviar notificación push si tiene token
  if (usuario && usuario.tokenfcm) {
    await pushService.enviarNotificacionPush(
      usuario.tokenfcm,
      "Nueva notificación",
      mensaje
    );
  }

  return notificacion;
}

async function listarNotificaciones(id_usuario) {
  return await Notificacion.findAll({
    where: { id_usuario },
    order: [["fecha", "DESC"]],
  });
}

async function marcarComoLeida(id) {
  const noti = await Notificacion.findByPk(id);
  if (!noti) return null;
  noti.leida = true;
  await noti.save();
  return noti;
}

module.exports = {
  crearNotificacion,
  listarNotificaciones,
  marcarComoLeida,
};
