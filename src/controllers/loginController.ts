import type { Context } from 'hono'
import * as service from '../service/login.js'

export const loginAdmin = async (c: Context) => {
    try {
        const payload = await c.req.json()
        const token = await service.createLoginToken(payload.username, payload.password)
        return c.json({ token })
    } catch (err: any) {
        console.error('POST /login error', err)
        if (err.message === 'invalid_credentials') return c.text('Invalid credentials', 401)
        return c.text('Internal Server Error', 500)
    }
}
