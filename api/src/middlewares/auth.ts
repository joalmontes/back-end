// src/Middlewares/auth.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

// ------------------------------
// Extensión de Request para incluir user
// ------------------------------
export interface AuthRequest extends Request {
    user?: any; // Almacena la información decodificada del JWT
}

// ------------------------------
// Middleware para requerir autenticación
// ------------------------------
export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
    // Tomamos el header Authorization (puede estar en mayúscula o minúscula)
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];

    // Si no existe el header, retornamos error
    if (!authHeader) return res.status(401).json({ message: 'No token' });

    // Extraemos el token, eliminando "Bearer " si existe
    const token = authHeader.toString().replace(/^Bearer\s+/i, '');

    // Si no hay token después del Bearer
    if (!token) return res.status(401).json({ message: 'No token' });

    try {
        // Verificamos el token usando la clave secreta definida en env
        const payload = jwt.verify(token, env.jwtSecret);

        // Guardamos el payload en req.user para que los controladores puedan usarlo
        req.user = payload;

        // Continuamos con la siguiente función o middleware
        next();
    } catch {
        // Si el token es inválido o expiró, retornamos error
        return res.status(401).json({ message: 'Invalid token' });
    }
};

/*
------------------------------
Resumen del funcionamiento
------------------------------
1. Busca el token en el header Authorization.
2. Valida que el token exista y tenga el formato correcto ("Bearer <token>").
3. Usa la clave secreta (env.jwtSecret) para verificar la autenticidad del token.
4. Si es válido, agrega los datos decodificados del token a req.user.
5. Si no es válido o falta, devuelve un error 401 (Unauthorized).
*/
