import type { Context } from 'hono'
import * as service from '../service/squareWebhook.js'
import { WebhooksHelper } from 'square'

export const postSquareWebhook = async (c: Context) => {
  try {
    const isValid = await WebhooksHelper.verifySignature({
      requestBody: await c.req.text(),
      signatureHeader: c.req.header('x-square-hmacsha256-signature') || '',
      signatureKey: process.env.SQUARE_SIGNATURE_KEY || '',
      notificationUrl: process.env.SQUARE_WEBHOOK_URL || '',
    })

    if (!isValid) {
      console.error('Invalid Square webhook signature')
      return c.text('Forbidden', 403)
    }

    const payload = await c.req.json()
    await service.squareWebhook(payload)
    return c.text('OK', 200)
  } catch (err) {
    console.error('POST /squareWebhook error', err)
    return c.text('Internal Server Error', 500)
  }
}
