// src/module/incidents/routes.ts

import { Router, Response, NextFunction } from 'express';
import { Incident } from '../../db/models/Incident';
import { requireAuth, AuthRequest } from '../../middlewares/auth';
import { requireRole } from '../../middlewares/roles';
import { Roles } from '../../config/roles';

const router = Router();

// Crear incidente (solo operadores)
router.post(
    '/',
    requireAuth,                       // Valida JWT
    requireRole(Roles.OPERADOR, Roles.ADMIN),       // Valida rol
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            // Crear un nuevo incidente con los datos del body
            const incident = new Incident(req.body);
            await incident.save();

            res.status(201).json(incident); // Devuelve incidente creado
        } catch (err) {
            // En vez de capturar aquí,       // En vez de capturar aquí, idealmente pasarlo al middleware de errores global
            next(err);
        }
    }
);

// Listar incidentes (supervisores y jefes de área)
router.get(
    '/',
    requireAuth,
    requireRole(Roles.SUPERVISOR, Roles.JEFE_AREA, Roles.ADMIN),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const incidents = await Incident.find();
            res.json(incidents);
        } catch (err) {
            // En vez de capturar aquí,       // En vez de capturar aquí, idealmente pasarlo al middleware de errores global
            next(err);
        }
    }
);

export default router;
