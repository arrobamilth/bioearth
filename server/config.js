import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
dotenv.config({ path: path.join(rootDir, '.env'), quiet: true });

export const config = {
  rootDir,
  dataDir: path.join(rootDir, 'data'),
  dbPath: process.env.BIOEARTH_DB_PATH || path.join(rootDir, 'data', 'bioearth.sqlite'),
  port: Number(process.env.BIOEARTH_API_PORT || 4171),
  jwtSecret: process.env.BIOEARTH_JWT_SECRET || 'bioearth-local-dev-secret-change-before-production',
  jwtExpiresIn: process.env.BIOEARTH_JWT_EXPIRES_IN || '8h',
  adminSeed: {
    nombre: process.env.BIOEARTH_ADMIN_NAME || 'Administrador BioEarth',
    correo: process.env.BIOEARTH_ADMIN_EMAIL || 'admin@bioearth.local',
    password: process.env.BIOEARTH_ADMIN_PASSWORD || 'BioEarth2026!',
    rol: process.env.BIOEARTH_ADMIN_ROLE || 'superadmin',
  },
};
