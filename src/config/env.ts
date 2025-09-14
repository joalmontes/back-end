// src/config/env.ts
import dotenv from 'dotenv';
import { z } from 'zod';

// Cargar variables de entorno desde .env
dotenv.config();

// Esquema de validación con Zod
const schema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().default('4000'),
    MONGODB_URI: z.string().min(1, "MONGODB_URI es obligatorio"),
    JWT_SECRET: z.string().min(8, "JWT_SECRET debe tener al menos 8 caracteres"),
    LOG_LEVEL: z.string().default('info')
});

// Validar y parsear las variables
let _env;
try {
    _env = schema.parse(process.env);
} catch (err) {
    console.error("❌ Error cargando variables de entorno:", err);
    process.exit(1);
}

// Exportar variables de entorno tipadas
export const env = {
    nodeEnv: _env.NODE_ENV,
    port: Number(_env.PORT),
    mongoUri: _env.MONGODB_URI,
    jwtSecret: _env.JWT_SECRET,
    logLevel: _env.LOG_LEVEL
};
