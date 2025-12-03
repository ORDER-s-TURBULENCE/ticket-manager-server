import type { Context } from 'hono'
import * as service from '../service/squareWebhook.js'

export const postSquareWebhook = async (c: Context) => {
  try {
    const payload = await c.req.json()
    await service.squareWebhook(payload)
    return c.text('Created', 201)
  } catch (err) {
    console.error('POST /squareWebhook error', err)
    return c.text('Internal Server Error', 500)
  }
}
