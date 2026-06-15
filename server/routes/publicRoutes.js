import express from 'express';
import { createSolicitud } from '../models/solicitudModel.js';
import { validateSolicitudPayload } from '../utils/validation.js';

export const publicRouter = express.Router();

publicRouter.post('/contact', async (req, res, next) => {
  try {
    const validation = validateSolicitudPayload(req.body);
    if (!validation.valid) {
      return res.status(400).json({ message: 'Revisa los campos del formulario.', errors: validation.errors });
    }

    const solicitud = await createSolicitud(validation.data);
    return res.status(201).json({
      message: 'Solicitud recibida. El equipo de BioEarth se pondrá en contacto contigo.',
      solicitud,
    });
  } catch (error) {
    return next(error);
  }
});
