import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { findAdminById } from '../models/adminModel.js';

export async function requireAdmin(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: 'Sesión requerida.' });
    }

    const payload = jwt.verify(token, config.jwtSecret);
    const admin = await findAdminById(payload.sub);

    if (!admin) {
      return res.status(401).json({ message: 'Sesión inválida.' });
    }

    req.admin = admin;
    return next();
  } catch {
    return res.status(401).json({ message: 'Sesión expirada o inválida.' });
  }
}
