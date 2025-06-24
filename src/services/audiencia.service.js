// src/services/audiencia.service.js
const { Audiencia } = require("../models/audiencia.model"); // models/index.js
const { Usuario, AudienciaParte, Rol } = require("../models");
const { AudienciaUsuario } = require("../models/audiencia_usuario.model");
const { crearNotificacion } = require("../services/notificacion.service");

// const Rol = require("../models/rol.model");

/**
 * Crea una nueva audiencia
 * @param {Object} data { fecha, hora, expedienteId, sala, descripcion, estado }
 * @returns {Promise<Audiencia>}
 */
async function createAudiencia(data) {
  // Extraer la lista de usuarios si existe
  const { usuarios, ...audienciaData } = data;

  // Crear la audiencia
  const nueva = await Audiencia.create({
    id_expediente: audienciaData.id_expediente,
    fecha: audienciaData.fecha,
    sala: audienciaData.sala,
    ubicacion: audienciaData.ubicacion || "Sala 1",
    duracion: audienciaData.duracion || "1 hour",
    estado: audienciaData.estado || "Pendiente",
    observacion: audienciaData.observacion || "UwU",
  });

  // Si hay usuarios para asignar, procesarlos
  if (usuarios && Array.isArray(usuarios) && usuarios.length > 0) {
    for (const usuario of usuarios) {
      // Verificar que cada objeto de usuario tenga la estructura correcta
      if (usuario.id_usuario && usuario.cargo) {
        await addUsuarioAudiencia(
          nueva.id_audiencia,
          usuario.id_usuario,
          usuario.cargo
        );
      }
    }
  }

  return nueva;
}

async function listAudiencias() {
  return Audiencia.findAll({
    order: [["fecha", "ASC"]],
  });
}

async function getAudienciaById(id) {
  return Audiencia.findByPk(id);
}

async function updateAudiencia(id, data) {
  const [n, [updated]] = await Audiencia.update(data, {
    where: { id },
    returning: true,
  });
  return n ? updated : null;
}

async function deleteAudiencia(id) {
  const n = await Audiencia.destroy({ where: { id } });
  return Boolean(n);
}

async function resolverAudiencia(id, { resultado }) {
  const audiencia = await Audiencia.findByPk(id);
  if (!audiencia) throw new Error("Audiencia no encontrada");

  audiencia.estado = "resuelta";
  audiencia.resultado = resultado;
  audiencia.fechaResolucion = new Date();

  await audiencia.save();
  return audiencia;
}

async function addParte(audId, parteId) {
  const aud = await Audiencia.findByPk(audId);
  const parte = await ParteInvolucrada.findByPk(parteId);
  if (!aud || !parte) throw new Error("Audiencia o Parte no existe");
  await aud.addParteInvolucrada(parte);
  return;
}

async function listPartes(audId) {
  const aud = await Audiencia.findByPk(audId, {
    include: { model: ParteInvolucrada, through: { attributes: [] } },
  });
  return aud ? aud.ParteInvolucradas : [];
}

async function removeParte(audId, parteId) {
  const aud = await Audiencia.findByPk(audId);
  const parte = await ParteInvolucrada.findByPk(parteId);
  if (!aud || !parte) throw new Error("No existe");
  await aud.removeParteInvolucrada(parte);
  return;
}

async function addUsuarioAudiencia(id_audiencia, id_usuario, cargo) {
  const audiencia = await Audiencia.findByPk(id_audiencia);
  const usuario = await Usuario.findByPk(id_usuario);
  if (!audiencia || !usuario) throw new Error("Usuario o Audiencia no existe");

  // Crear la relación en la tabla intermedia
  await AudienciaUsuario.create({
    id_audiencia: id_audiencia,
    id_usuario: id_usuario,
    cargo: cargo,
  });

  // Formatear la fecha para la notificación
  const fechaFormateada = new Date(audiencia.fecha).toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Crear el mensaje de notificación
  const mensaje = `Has sido asignado a una audiencia como ${cargo}. Fecha: ${fechaFormateada}. Ubicación: ${audiencia.ubicacion}.`;

  // Enviar notificación (esto también enviará notificación push si el usuario tiene token FCM)
  await crearNotificacion(id_usuario, mensaje);

  return true;
}

async function getAudienciasByUsuario(id_usuario) {
  // Verificar si el usuario existe
  const usuario = await Usuario.findByPk(id_usuario);
  if (!usuario) throw new Error("Usuario no encontrado");

  // Buscar las audiencias asociadas al usuario
  const audienciaUsuarios = await AudienciaUsuario.findAll({
    where: { id_usuario },
  });

  // Si no hay audiencias asociadas, devolver array vacío
  if (!audienciaUsuarios.length) return [];

  // Extraer IDs de audiencias
  const audienciaIds = audienciaUsuarios.map((au) => au.id_audiencia);

  // Buscar las audiencias completas
  return Audiencia.findAll({
    where: {
      id_audiencia: audienciaIds,
    },
    order: [["fecha", "ASC"]],
  });
}

async function getUsuariosPorAudiencia(id_audiencia) {
  // Verificar que la audiencia exista
  const audiencia = await Audiencia.findByPk(id_audiencia);
  if (!audiencia) {
    throw new Error("Audiencia no encontrada");
  }

  // Buscar todos los registros en la tabla intermedia
  const audienciaUsuarios = await AudienciaUsuario.findAll({
    where: { id_audiencia },
    include: [
      {
        model: Usuario,
        as: "usuario",
        attributes: ["id_usuario", "nombre", "apellido", "correo", "id_rol"],
        include: [
          {
            model: Rol,
            as: "rol",
            attributes: ["id_rol"],
          },
        ],
      },
    ],
  });

  // Si no hay usuarios asignados, devolver array vacío
  if (!audienciaUsuarios.length) return [];

  // Formatear los resultados para devolver solo la información relevante
  return audienciaUsuarios.map((au) => ({
    id_usuario: au.usuario.id_usuario,
    nombre: au.usuario.nombre,
    apellido: au.usuario.apellido,
    correo: au.usuario.correo,
    rol: au.usuario.rol?.id_rol,
    cargo_en_audiencia: au.cargo,
  }));
}

module.exports = {
  createAudiencia,
  listAudiencias,
  getAudienciaById,
  updateAudiencia,
  deleteAudiencia,
  resolverAudiencia,
  addParte,
  listPartes,
  removeParte,
  addUsuarioAudiencia,
  getAudienciasByUsuario,
  getUsuariosPorAudiencia,
};
