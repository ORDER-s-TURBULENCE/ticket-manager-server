import type { Context } from 'hono'
import * as service from '../service/movie.js'

export const getMovies = async (c: Context) => {
  try {
    const movies = await service.getMovies()
    return c.json(movies)
  } catch (err) {
    console.error('GET /movies error', err)
    return c.text('Internal Server Error', 500)
  }
}

export const postMovies = async (c: Context) => {
  try {
    const payload = await c.req.json()
    const created = await service.postMovies(payload)
    return c.json(created, 201)
  } catch (err) {
    console.error('POST /movies error', err)
    return c.text('Internal Server Error', 500)
  }
}
