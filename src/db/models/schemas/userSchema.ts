// src/db/models/schemas/userSchemar

import { z } from "zod";

// Schema para crear usuario

export const createUserSchema = z.object({

    // Nombre obligatorio, mínimo 1 caracter
    nombres: z.string().min(1, "El nombre es requerido"),

    // Apellido obligatorio, mínimo 1 caracter
    apellidos: z.string().min(1, "El apellido es requerido"),

    // RUT chileno obligatorio, validado con expresión regular
    // Debe tener entre 7 y 8 dígitos, seguido de guion y dígito verificador (número o K/k)
    rut: z.string().regex(/^\d{7,8}-[0-9Kk]$/, "Formato de RUT inválido"),

    // Contraseña obligatoria, mínimo 6 caracteres
    // Se usará para login y debe ser hasheada antes de guardar en la base de datos
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"), // nuevo campo

    // Cargo opcional del usuario (Ej: Operador, Supervisor, Jefe de área, Administrador)
    cargo: z.string().optional(),

    // Región opcional del usuario
    region: z.string().optional()
});


// Schema para actualizar usuario

// Permite enviar solo los campos que se quieran actualizar
// Todos los campos son opcionales
export const updateUserSchema = createUserSchema.partial();

// Tipo TypeScript inferido

// Sirve para tipar los datos que llegan en req.body al crear o actualizar un usuario
export type UserDTO = z.infer<typeof createUserSchema>;
