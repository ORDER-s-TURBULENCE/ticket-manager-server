import { sign } from "hono/jwt";
import { prisma } from "../../lib/prisma.js";
import bcrypt from "bcrypt";

export const createLoginToken = async (username: string, password: string) => {
    const admin = await prisma.admin.findUnique(
        { where: { username } }
    );

    if (!admin) throw new Error('invalid_credentials');

    const match = await bcrypt.compare(password, admin.password);
    if (!match) throw new Error('invalid_credentials');

    const token = await sign(
        { 
            id: admin.id, 
            username: admin.username,
            exp: Math.floor(Date.now() / 1000) + (8 * 60 * 60), // 8 hours expiration
        },
        process.env.JWT_SECRET!,
        'HS256'
    );
    return token;
}

export const createAdmin = async (username: string, password: string) => {
    const existingAdmin = await prisma.admin.findUnique({ where: { username } });
    if (existingAdmin) throw new Error('username_already_exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await prisma.admin.create({
        data: {
            username,
            password: hashedPassword,
        },
    });
    return newAdmin;
}
