// src/module/incidents/contraller.ts

import { Router } from 'express';

// Importamos los submódulos de rutas
import userRoutes from './module/users/routes';
import incidentRoutes from './module/incidents/routes';

// Creamos el enrutador principal
const router = Router();

/**
 * Todas las rutas relacionadas con usuarios
 * -> /api/users
 */
router.use('/api/users', userRoutes);

/**
 * Todas las rutas relacionadas con incidentes
 * -> /api/incidents
 */
router.use('/api/incidents', incidentRoutes);

export default router;
