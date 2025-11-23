import { Hono } from 'hono'
import movies from './routes/movies.js'

const api = new Hono()
api.route('/movies', movies)

const app = new Hono()
app.get('/', (c) => c.text('OK'))
app.route('/api/v1', api)

export default app
