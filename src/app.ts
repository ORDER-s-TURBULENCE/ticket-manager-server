import { Hono } from 'hono'
import api from './routes/route.js'

const app = new Hono()
app.get('/', (c) => c.text('OK'))
app.route('/api/v1', api)

export default app
