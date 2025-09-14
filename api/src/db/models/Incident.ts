// src/db/models/Incident.ts

import { Schema, model, Document } from 'mongoose';

// --- Interfaces auxiliares ---

// Datos de la persona involucrada
interface Persona {
    nombre_completo: string;
    rut: string;
    fecha_nacimiento?: string;
    direccion?: string;
    comuna?: string;
    telefono?: string;
    email?: string;
}

// Datos del vehículo
interface Vehiculo {
    marca: string;
    modelo: string;
    anio?: number;
    patente: string;
    numero_motor?: string;
    vin_chasis?: string;
}

// Vehículo involucrado + datos de la persona y aseguradora
interface VehiculoInvolucrado {
    persona: Persona;
    vehiculo: Vehiculo;
    aseguradora?: string;
}

// Interface principal del incidente
export interface IIncident extends Document {
    formId: string;
    metadata: {
        createdAt: Date;
        version: string;
        origen?: string;
    };
    antecedentes_siniestro: {
        fecha_accidente?: string;
        hora_accidente?: string;
        lugar_accidente?: string;
        comuna?: string;
        concurrio_carabineros?: boolean | null;
        se_tomo_alcoholemia?: boolean | null;
        lesionados?: boolean | null;
        danos_materiales?: boolean | null;
        numero_vehiculos_involucrados?: number;
        vehiculos_distintos_de_a_y_b?: boolean | null;
        objetos_distintos_al_vehiculo?: boolean | null;
    };
    vehiculo_a: VehiculoInvolucrado;
    vehiculos_b: VehiculoInvolucrado[];  // varios vehículos tipo B
    declaracion?: {
        entendido_procedimiento?: boolean | null;
        acepta_declaracion_jurada?: boolean | null;
        lugar_firma?: string;
        fecha_firma?: string;
    };
    firmas?: {
        vehiculo_a?: string;
        vehiculo_b?: string;
    };
    adjuntos?: {
        fotos: string[];
        croquis?: string;
        otros?: string[];
    };
    createdAt: Date;
    updatedAt: Date;
}

// --- Schemas auxiliares ---
const PersonaSchema = new Schema<Persona>(
    {
        nombre_completo: { type: String, required: true },
        rut: { type: String, required: true },
        fecha_nacimiento: String,
        direccion: String,
        comuna: String,
        telefono: String,
        email: String
    },
    { _id: false } // evita crear _id en subdocumentos
);

const VehiculoSchema = new Schema<Vehiculo>(
    {
        marca: { type: String, required: true },
        modelo: { type: String, required: true },
        anio: Number,
        patente: { type: String, required: true },
        numero_motor: String,
        vin_chasis: String
    },
    { _id: false }
);

const VehiculoInvolucradoSchema = new Schema<VehiculoInvolucrado>(
    {
        persona: { type: PersonaSchema, required: true },
        vehiculo: { type: VehiculoSchema, required: true },
        aseguradora: String
    },
    { _id: false }
);

// --- Schema principal del incidente ---

const IncidentSchema = new Schema<IIncident>(
    {
        formId: { type: String, required: true },
        metadata: {
            createdAt: { type: Date, default: Date.now },
            version: { type: String, required: true },
            origen: String
        },
        antecedentes_siniestro: {
            fecha_accidente: String,
            hora_accidente: String,
            lugar_accidente: String,
            comuna: String,
            concurrio_carabineros: { type: Boolean, default: null },
            se_tomo_alcoholemia: { type: Boolean, default: null },
            lesionados: { type: Boolean, default: null },
            danos_materiales: { type: Boolean, default: null },
            numero_vehiculos_involucrados: Number,
            vehiculos_distintos_de_a_y_b: { type: Boolean, default: null },
            objetos_distintos_al_vehiculo: { type: Boolean, default: null }
        },
        vehiculo_a: { type: VehiculoInvolucradoSchema, required: true },
        vehiculos_b: { type: [VehiculoInvolucradoSchema], default: [] }, // array de vehículos B
        declaracion: {
            entendido_procedimiento: { type: Boolean, default: null },
            acepta_declaracion_jurada: { type: Boolean, default: null },
            lugar_firma: String,
            fecha_firma: String
        },
        firmas: {
            vehiculo_a: String,
            vehiculo_b: String
        },
        adjuntos: {
            fotos: { type: [String], default: [] },
            croquis: String,
            otros: { type: [String], default: [] }
        }
    },
    {
        timestamps: true, // createdAt / updatedAt
        versionKey: false
    }
);

// Exportamos el modelo de Mongoose
export const Incident = model<IIncident>('Incident', IncidentSchema);
