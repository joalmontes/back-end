// src/middlewares/error.ts
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware global de manejo de errores
 * Captura cualquier error lanzado en rutas o middlewares y responde con JSON
 */
export function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.error(err); // Para debug en consola

    // Si el error ya tiene un status (ej: 400, 401), úsalo; si no, 500
    const statusCode = err.status || 500;

    // Mensaje de error para el cliente
    const message = err.message || 'Internal Server Error';

    // Respuesta en JSON
    res.status(statusCode).json({
        error: {
            message,
            // Opcional: información extra del error
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
}
