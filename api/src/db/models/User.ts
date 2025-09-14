// src/db/models/User.ts

import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

// Interfaz del usuario
export interface IUser extends Document {
    nombres: string;               // Nombres del usuario
    apellidos: string;             // Apellidos
    rut: string;                   // RUT chileno (formato 12.345.678-9)
    password: string;              // Contraseña (hashed)
    cargo?: string;                // Cargo o rol del usuario
    region?: string;               // Región
    createdAt: Date;               // Fecha de creación (automático)
    updatedAt: Date;               // Fecha de actualización (automático)

    // Método para comparar password en login
    comparePassword(candidatePassword: string): Promise<boolean>;
}

// Definición del Schema de Mongoose
const UserSchema = new Schema<IUser>(
    {
        nombres: { type: String, required: true, trim: true },
        apellidos: { type: String, required: true, trim: true },
        rut: { type: String, required: true, unique: true, trim: true },
        password: { type: String, required: true },
        cargo: { type: String, default: null },
        region: { type: String, default: null }
    },
    {
        timestamps: true,   // crea createdAt y updatedAt automáticamente
        versionKey: false   // desactiva el __v de Mongoose
    }
);

// Middleware pre-save: antes de guardar un usuario
UserSchema.pre<IUser>('save', async function (next) {
    // Solo hashea si la contraseña fue modificada o es nueva
    if (!this.isModified('password')) return next();

    // Generar un salt y hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

// Método de instancia para comparar la contraseña ingresada con el hash
UserSchema.methods.comparePassword = async function (candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Exportar el modelo de Mongoose
export const User = model<IUser>('User', UserSchema);
