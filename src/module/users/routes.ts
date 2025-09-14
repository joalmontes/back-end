// src/module/users/routes.ts

import { Router, Request, Response, NextFunction } from 'express';
import { User } from '../../db/models/User';
import { requireAuth, AuthRequest } from '../../middlewares/auth';
import { requireRole } from '../../middlewares/roles';
import { Roles } from '../../config/roles';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';

const router = Router();

// Crear usuario (solo admin o jefe de área) 
router.post(
    '/',
    requireAuth,
    requireRole(Roles.ADMIN, Roles.JEFE_AREA),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { nombres, apellidos, rut, password, cargo, region } = req.body;

            if (!password || password.length < 6)
                throw new Error('Password debe tener al menos 6 caracteres');

            const existingUser = await User.findOne({ rut });
            if (existingUser) throw new Error('Usuario ya existe');

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({ nombres, apellidos, rut, password: hashedPassword, cargo, region });
            await user.save();

            res.status(201).json(user);
        } catch (err) {
            next(err); // Se pasa al middleware global
        }
    }
);

// Listar usuarios (solo admin y jefe de área)
router.get(
    '/',
    requireAuth,
    requireRole(Roles.ADMIN, Roles.JEFE_AREA),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const users = await User.find();
            res.json(users);
        } catch (err) {
            next(err);
        }
    }
);

// Login (no requiere token) (todos los usuario pueden)
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { rut, password } = req.body;
        if (!rut || !password) throw new Error('Rut y password son requeridos');

        const user = await User.findOne({ rut });
        if (!user) throw new Error('Usuario no encontrado');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error('Contraseña incorrecta');

        const token = jwt.sign({ id: user._id, rut: user.rut, cargo: user.cargo }, env.jwtSecret, {
            expiresIn: '1h'
        });

        res.json({ token, user });
    } catch (err) {
        next(err);
    }
});

export default router;