import { Hono } from 'hono'
import type { Context } from 'hono'
import { getMovies,  postMovies } from '../service/movie.js'

const router = new Hono()

router.get('/', async (c: Context) => {
  try {
    const movies = await getMovies()
    return c.json(movies)
  } catch (err) {
    console.error('GET /movies error', err)
    return c.text('Internal Server Error', 500)
  }
})

router.post('/', async (c: Context) => {
  try {
    const payload = await c.req.json()
    const newMovie = await postMovies(payload)
    return c.json(newMovie, 201)
  } catch (err) {
    console.error('POST /movies error', err)
    return c.text('Internal Server Error', 500)
  }
})

export default router
