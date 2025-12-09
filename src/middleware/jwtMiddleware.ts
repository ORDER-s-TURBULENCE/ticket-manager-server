
import { Context } from "hono";
import { verify } from "hono/jwt";

export const jwtMiddleware = async (c: Context, next: () => Promise<void>) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return c.text('Unauthorized', 401);
    }

    try {
        const payload = await verify(
            authHeader.substring(7),
            process.env.JWT_SECRET!,
            'HS256'
        );
        c.set('jwtPayload', payload);
        return await next();
    } catch (err) {
        return c.text('Unauthorized', 401);
    }
}
