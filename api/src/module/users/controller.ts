// src/module/users/controller.ts
import { Request, Response } from "express";
import { User } from "../../db/models/User";
import { createUserSchema } from "../../db/models/schemas/userSchema";
import bcrypt from "bcryptjs"; // para hash de contraseñas
import jwt from "jsonwebtoken"; // para generar JWT
import { env } from "../../config/env";


/**
 * Crear un nuevo usuario
 * POST /api/users
 */
export async function createUser(req: Request, res: Response) {
    try {
        // Validar los datos de entrada usando Zod
        const data = createUserSchema.parse(req.body);

        // Verificar si el usuario ya existe por RUT
        const existingUser = await User.findOne({ rut: data.rut });
        if (existingUser) return res.status(400).json({ message: "Usuario ya existe" });

        // Hashear contraseña antes de guardar
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Crear usuario en la base de datos
        const user = await User.create({ ...data, password: hashedPassword });
        // Responder con 201 Created y el usuario creado
        res.status(201).json(user);
    } catch (err: any) {
        // En caso de error, responder con 400 Bad Request
        res.status(400).json({ error: err.errors || err.message });
    }
}

/**
 * Listar todos los usuarios
 * GET /api/users
 */
export async function listUsers(req: Request, res: Response) {
    const users = await User.find().lean();
    res.json(users);
}

/**
 * Login de usuario
 * POST /api/users/login
 * - Valida RUT y contraseña
 * - Genera un token JWT válido por 1 hora
 */
export async function loginUser(req: Request, res: Response) {
    const { rut, password } = req.body;

    // Validar entrada
    if (!rut || !password) return res.status(400).json({ message: "Rut y password son requeridos" });

    // Buscar usuario por RUT
    const user = await User.findOne({ rut });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    // Comparar contraseña ingresada con la guardada en DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Contraseña incorrecta" });

    // Generar JWT
    // Incluir el cargo en el token para verificar roles luego
    const token = jwt.sign(
        { id: user._id, rut: user.rut, cargo: user.cargo },
        env.jwtSecret,
        { expiresIn: "1h" } // Token expira en 1 hora
    );

    // Responder con token y datos del usuario
    res.json({ token, user });
}
