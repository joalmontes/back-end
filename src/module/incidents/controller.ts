// src/module/incidents/contraller.ts

import { Request, Response } from "express";
import { Incident } from "../../db/models/Incident";
import { createIncidentSchema } from "../../db/models/schemas/incidentSchema";


/**
 * Crear un nuevo incidente
 * - Valida los datos con Zod (createIncidentSchema)
 * - Guarda en la base de datos MongoDB usando el modelo Incident
 * - Responde con 201 Created y el objeto creado
 */
export async function createIncident(req: Request, res: Response) {
    try {
        // Validación de los datos entrantes
        const data = createIncidentSchema.parse(req.body);
        // Crear el incidente en la base de datos
        const incident = await Incident.create(data);
        // Responder con el incidente creado
        res.status(201).json(incident);
    } catch (err: any) {
        // En caso de error de validación o de MongoDB
        res.status(400).json({ error: err.errors || err.message });
    }
}

/**
 * Listar todos los incidentes
 * - Ordenados por fecha de creación descendente
 * - Responde con un array de incidentes
 */
export async function listIncidents(req: Request, res: Response) {
    const incidents = await Incident.find().sort({ createdAt: -1 }).lean();
    res.json(incidents);
}
