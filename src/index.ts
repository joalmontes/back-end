// src/index.ts

import express from 'express';
import { connectDB } from './db/connect';
import routes from './routes';
import { env } from './config/env';
import { errorHandler } from './middlewares/error';

// Inicializar la app de Express
const app = express();

// Middleware para parsear JSON en las peticiones
app.use(express.json());
// Montar el router principal (users e incidents)
app.use(routes);
//Manejo global de errores
app.use(errorHandler);

// Conectar a la base de datos y luego iniciar el servidor
connectDB().then(() => {
    app.listen(env.port, () => {
        console.log(`Server esta funcionando en el puerto ${env.port}`);
    });
}).catch(err => {
    console.error('Error en la connexión de la BD', err);
});