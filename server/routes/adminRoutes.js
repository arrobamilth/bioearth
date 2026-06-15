import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { requireAdmin } from '../middleware/auth.js';
import { findAdminByEmail } from '../models/adminModel.js';
import {
  deleteSolicitud,
  getSolicitudById,
  getSolicitudStats,
  listSolicitudes,
  updateSolicitud,
} from '../models/solicitudModel.js';
import { sanitizeText, validateLoginPayload, validateSolicitudUpdate } from '../utils/validation.js';

export const adminRouter = express.Router();

adminRouter.post('/login', async (req, res, next) => {
  try {
    const validation = validateLoginPayload(req.body);
    if (!validation.valid) {
      return res.status(400).json({ message: 'Credenciales inválidas.', errors: validation.errors });
    }

    const admin = await findAdminByEmail(validation.data.correo);
    if (!admin) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos.' });
    }

    const validPassword = await bcrypt.compare(validation.data.password, admin.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos.' });
    }

    const token = jwt.sign({ sub: admin.id, rol: admin.rol }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });

    return res.json({
      token,
      admin: {
        id: admin.id,
        nombre: admin.nombre,
        correo: admin.correo,
        rol: admin.rol,
      },
    });
  } catch (error) {
    return next(error);
  }
});

adminRouter.use(requireAdmin);

adminRouter.get('/me', (req, res) => {
  res.json({ admin: req.admin });
});

adminRouter.get('/dashboard', async (req, res, next) => {
  try {
    res.json({ stats: await getSolicitudStats() });
  } catch (error) {
    next(error);
  }
});

adminRouter.get('/solicitudes', async (req, res, next) => {
  try {
    const solicitudes = await listSolicitudes({
      estado: sanitizeText(req.query.estado, 40),
      search: sanitizeText(req.query.search, 80),
    });
    res.json({ solicitudes });
  } catch (error) {
    next(error);
  }
});

adminRouter.get('/solicitudes/:id', async (req, res, next) => {
  try {
    const solicitud = await getSolicitudById(req.params.id);
    if (!solicitud) {
      return res.status(404).json({ message: 'Solicitud no encontrada.' });
    }
    return res.json({ solicitud });
  } catch (error) {
    return next(error);
  }
});

adminRouter.patch('/solicitudes/:id', async (req, res, next) => {
  try {
    const validation = validateSolicitudUpdate(req.body);
    if (!validation.valid) {
      return res.status(400).json({ message: 'No se pudo actualizar la solicitud.', errors: validation.errors });
    }

    const solicitud = await updateSolicitud(req.params.id, validation.data, req.admin.id);
    if (!solicitud) {
      return res.status(404).json({ message: 'Solicitud no encontrada.' });
    }
    return res.json({ solicitud });
  } catch (error) {
    return next(error);
  }
});

adminRouter.delete('/solicitudes/:id', async (req, res, next) => {
  try {
    const deleted = await deleteSolicitud(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Solicitud no encontrada.' });
    }
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});
