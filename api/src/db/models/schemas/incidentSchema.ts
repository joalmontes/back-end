// src/db/models/schemas/inccidentSchemar

import { z } from "zod";

// Subschemas

const personaSchema = z.object({
    nombre_completo: z.string().min(1, "Nombre obligatorio"),    // Nombre completo obligatorio
    rut: z.string().regex(/^\d{7,8}-[0-9Kk]$/, "RUT inválido"),  // RUT chileno obligatorio
    fecha_nacimiento: z.string().optional(),                     // Fecha de nacimiento opcional
    direccion: z.string().optional(),                            // Dirección opcional
    comuna: z.string().optional(),                               // Comuna opcional
    telefono: z.string().optional(),                             // Teléfono opcional
    email: z.string().email().optional()                         // Email opcional y validado
});

// Vehículo involucrado
const vehiculoSchema = z.object({
    marca: z.string().min(1),               // Marca obligatoria
    modelo: z.string().min(1),              // Modelo obligatorio
    anio: z.number().optional(),            // Año opcional
    patente: z.string().min(3),             // Patente obligatoria (mín 3 caracteres)
    numero_motor: z.string().optional(),    // Número de motor opcional
    vin_chasis: z.string().optional()       // VIN/Chasis opcional
});

// Vehículo involucrado + persona + aseguradora
const vehiculoInvolucradoSchema = z.object({
    persona: personaSchema,              // Persona que conduce o es responsable
    vehiculo: vehiculoSchema,            // Vehículo asociado
    aseguradora: z.string().optional()   // Aseguradora opcional
});

// Schema principal del incidente
export const incidentSchema = z.object({
    formId: z.string().min(1),
    metadata: z.object({
        createdAt: z.date().optional(),
        version: z.string().default("1.0.0"),
        origen: z.string().optional()
    }),
    antecedentes_siniestro: z.object({
        fecha_accidente: z.string().optional(),
        hora_accidente: z.string().optional(),
        lugar_accidente: z.string().optional(),
        comuna: z.string().optional(),
        concurrio_carabineros: z.boolean().nullable().optional(),
        se_tomo_alcoholemia: z.boolean().nullable().optional(),
        lesionados: z.boolean().nullable().optional(),
        danos_materiales: z.boolean().nullable().optional(),
        numero_vehiculos_involucrados: z.number().optional(),
        vehiculos_distintos_de_a_y_b: z.boolean().nullable().optional(),
        objetos_distintos_al_vehiculo: z.boolean().nullable().optional()
    }),
    vehiculo_a: vehiculoInvolucradoSchema,
    vehiculos_b: z.array(vehiculoInvolucradoSchema).default([]), //  múltiples
    declaracion: z
        .object({
            entendido_procedimiento: z.boolean().nullable().optional(),
            acepta_declaracion_jurada: z.boolean().nullable().optional(),
            lugar_firma: z.string().optional(),
            fecha_firma: z.string().optional()
        })
        .optional(),
    firmas: z
        .object({
            vehiculo_a: z.string().optional(),
            vehiculo_b: z.string().optional()
        })
        .optional(),
    adjuntos: z
        .object({
            fotos: z.array(z.string()).default([]),
            croquis: z.string().optional(),
            otros: z.array(z.string()).default([])
        })
        .optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional()
});

// Para crear un incidente (omitimos createdAt / updatedAt)
export const createIncidentSchema = incidentSchema.omit({
    createdAt: true,
    updatedAt: true
});

// Para actualizar un incidente (todos los campos opcionales)
export const updateIncidentSchema = incidentSchema.partial();

// Tipo TypeScript inferido para DTO
export type IncidentDTO = z.infer<typeof createIncidentSchema>;
