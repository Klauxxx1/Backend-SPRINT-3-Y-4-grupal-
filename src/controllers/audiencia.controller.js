// src/controllers/audiencia.controller.js
const {
  createAudiencia,
  listAudiencias,
  getAudienciaById,
  updateAudiencia,
  deleteAudiencia,
  resolverAudiencia,
} = require("../services/audiencia.service");

const { crearNotificacion } = require("../services/notificacion.service");

const audService = require("../services/audiencia.service");

async function crearAudiencia(req, res) {
  try {
    const nueva = await createAudiencia(req.body);
    res.status(201).json({
      mensaje: "Audiencia creada correctamente",
      audiencia: nueva,
      usuarios_asignados: req.body.usuarios ? req.body.usuarios.length : 0,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ mensaje: "Error al crear audiencia", error: err.message });
  }
}

async function listarAudiencias(req, res) {
  try {
    const todas = await listAudiencias();
    res.json(todas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al listar audiencias" });
  }
}

async function obtenerAudiencia(req, res) {
  try {
    const aud = await getAudienciaById(req.params.id);
    if (!aud)
      return res.status(404).json({ mensaje: "Audiencia no encontrada" });
    res.json(aud);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al obtener audiencia" });
  }
}

async function actualizarAudiencia(req, res) {
  try {
    const updated = await updateAudiencia(req.params.id, req.body);
    if (!updated)
      return res.status(404).json({ mensaje: "Audiencia no encontrada" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al actualizar audiencia" });
  }
}

async function eliminarAudiencia(req, res) {
  try {
    const borrado = await deleteAudiencia(req.params.id);
    if (!borrado)
      return res.status(404).json({ mensaje: "Audiencia no encontrada" });
    res.json({ mensaje: "Audiencia eliminada" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al eliminar audiencia" });
  }
}

async function resolverAudienciaController(req, res) {
  try {
    const { id } = req.params;
    const { resultado } = req.body;

    if (!resultado) {
      return res
        .status(400)
        .json({ mensaje: "Debe proporcionar un resultado de resolución" });
    }

    const aud = await resolverAudiencia(id, resultado);
    if (!aud)
      return res.status(404).json({ mensaje: "Audiencia no encontrada" });

    // ✅ Crear notificación al juez
    if (aud.id_juez) {
      await crearNotificacion(
        aud.id_juez,
        `La audiencia ${id} fue marcada como resuelta.`
      );
    }

    res.json({
      mensaje: "Audiencia resuelta correctamente",
      data: aud,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al resolver audiencia" });
  }
}

async function postParte(req, res) {
  try {
    await audService.addParte(req.params.id, req.body.id_parte);
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function getPartes(req, res) {
  try {
    const list = await audService.listPartes(req.params.id);
    res.json(list);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function deleteParte(req, res) {
  try {
    await audService.removeParte(req.params.id, req.params.parteId);
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
//--------------------------------------------------asdasdasdasdsdsaasd
async function postUsuario(req, res) {
  try {
    const { id_audiencia, id_usuario, cargo } = req.body;

    // Primero vinculamos el usuario a la audiencia
    await audService.addUsuarioAudiencia(id_audiencia, id_usuario, cargo);

    // Obtenemos información detallada de la audiencia para la notificación
    const audiencia = await audService.getAudienciaById(id_audiencia);

    if (audiencia) {
      // Formateamos la fecha para mostrarla en la notificación
      const fechaFormateada = new Date(audiencia.fecha).toLocaleString(
        "es-ES",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      );

      // Creamos el mensaje de notificación
      const mensaje = `Has sido asignado a una audiencia como ${cargo}. Fecha: ${fechaFormateada}. Ubicación: ${audiencia.ubicacion}.`;

      // Enviamos la notificación al usuario
      await crearNotificacion(id_usuario, mensaje);

      res.status(200).json({
        mensaje: "Usuario vinculado a audiencia correctamente",
        notificacion: "Notificación enviada al usuario",
      });
    } else {
      res.status(200).json({
        mensaje: "Usuario vinculado a audiencia correctamente",
        notificacion: "No se pudo enviar notificación: audiencia no encontrada",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
}

async function actualizarObservacion(req, res) {
  try {
    const { observacion } = req.body;
    const actualizado = await audService.updateAudiencia(req.params.id, {
      observacion,
    });
    if (!actualizado)
      return res.status(404).json({ mensaje: "Audiencia no encontrada" });
    res.json({ mensaje: "Observación actualizada", audiencia: actualizado });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al actualizar observación" });
  }
}

async function getAudienciaUsuarios(req, res) {
  try {
    const id_usuario = req.params.id;
    // console.log("ID de usuario:", req.params.id);
    // Validar que se proporcionó un id de usuario
    if (!id_usuario) {
      return res.status(400).json({
        mensaje: "Se requiere el ID del usuario",
      });
    }

    const audiencias = await audService.getAudienciasByUsuario(id_usuario);
    res.json(audiencias);
  } catch (err) {
    console.error(err);
    // Si el error es "Usuario no encontrado", devolver 404
    if (err.message === "Usuario no encontrado") {
      return res.status(404).json({ mensaje: err.message });
    }
    // Para otros errores, devolver 500
    res.status(500).json({
      mensaje: "Error al obtener audiencias del usuario",
    });
  }
}

async function getUsuariosAudiencia(req, res) {
  try {
    const { id } = req.params;

    // Validar que se proporcionó un id de audiencia
    if (!id) {
      return res.status(400).json({
        mensaje: "Se requiere el ID de la audiencia",
      });
    }

    const usuarios = await audService.getUsuariosPorAudiencia(id);
    res.json({
      id_audiencia: parseInt(id),
      cantidad_usuarios: usuarios.length,
      usuarios,
    });
  } catch (err) {
    console.error(err);
    // Si el error es "Audiencia no encontrada", devolver 404
    if (err.message === "Audiencia no encontrada") {
      return res.status(404).json({ mensaje: err.message });
    }
    // Para otros errores, devolver 500
    res.status(500).json({
      mensaje: "Error al obtener los usuarios de la audiencia",
    });
  }
}

module.exports = {
  crearAudiencia,
  listarAudiencias,
  obtenerAudiencia,
  actualizarAudiencia,
  eliminarAudiencia,
  resolverAudiencia,
  postParte,
  getPartes,
  deleteParte,
  postUsuario,
  actualizarObservacion,
  getAudienciaUsuarios,
  getUsuariosAudiencia,
};
