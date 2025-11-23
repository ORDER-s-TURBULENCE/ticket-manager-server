import 'dotenv/config'
import app from './app.js'
import { serve } from '@hono/node-server'

const port = Number(process.env.PORT ?? 8080)
const isProduction = process.env.NODE_ENV === 'production'

if (!isProduction) {
  console.log(`Server is running on http://localhost:${port}`)
  serve({
    fetch: app.fetch,
    port,
  })
} else {
  // In production, let the hosting platform invoke the app.
  console.log('Running in production; do not start local server')
}

export default app
