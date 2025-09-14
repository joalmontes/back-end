// src/db/connect.ts

import mongoose from 'mongoose';
import { env } from '../config/env';
import pino from 'pino';


const logger = pino({ level: env.logLevel });
/**
 * Conecta a MongoDB usando la URI definida en env.
 * Lanza error si no puede conectarse.
*/
export async function connectDB(): Promise<typeof mongoose> {
    try {
        // Evita warnings en Mongoose 7+
        mongoose.set('strictQuery', true);

        // Conexión a MongoDB
        const conn = await mongoose.connect(env.mongoUri, {
            dbName: 'ecotrack',
        });

        logger.info('MongoDB connected');
        return conn;
    } catch (err) {
        logger.error({ err }, 'MongoDB connection error');
        process.exit(1); // termina la app si no se conecta
    }
}
