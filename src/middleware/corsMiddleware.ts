import 'dotenv/config';
import { cors } from "hono/cors";

export const corsMiddleware = cors({
    origin: process.env.FRONTEND_BASE_URL!,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization'],
});
