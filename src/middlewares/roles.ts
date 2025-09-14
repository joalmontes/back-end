// src/middlewares/requireRole.ts
import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth";

/**
 * Middleware para verificar si el usuario tiene al menos uno de los roles permitidos.
 * @param allowedRoles Array de roles permitidos
 */
export const requireRole = (...allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        const user = req.user;
        if (!user || !user.cargo) {
            return res.status(403).json({ message: "No autorizado: sin rol" });
        }

        if (!allowedRoles.includes(user.cargo)) {
            return res.status(403).json({ message: "No autorizado: rol insuficiente" });
        }

        next();
    };
};
