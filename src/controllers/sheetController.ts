import type { Context } from 'hono'
import * as service from '../service/sheet.js'

export const getSheets = async (c: Context) => {
  try {
    const { movieId } = c.req.param()
    const res = await service.getSheetsByMovie(movieId)
    return c.json(res)
  } catch (err) {
    console.error('GET /movies/{movieId}/sheets error', err)
    return c.text('Internal Server Error', 500)
  }
}

export const postSheet = async (c: Context) => {
  try {
    const { movieId } = c.req.param()
    const payload = await c.req.json()
    await service.postSheetForMovie(movieId, payload)
    return c.text('Created', 201)
  } catch (err) {
    console.error('POST /movies/{movieId}/sheets error', err)
    return c.text('Internal Server Error', 500)
  }
}

export const getSheet = async (c: Context) => {
  try {
    const { sheetId } = c.req.param()
    const s = await service.getSheet(sheetId)
    if (!s) return c.text('Not Found', 404)
    return c.json(s)
  } catch (err) {
    console.error('GET /movies/{movieId}/sheets/{sheetId} error', err)
    return c.text('Internal Server Error', 500)
  }
}

export const patchSheet = async (c: Context) => {
  try {
    const { sheetId } = c.req.param()
    const payload = await c.req.json()
    await service.patchSheet(sheetId, payload)
    return c.text('Updated', 200)
  } catch (err) {
    console.error('PATCH /movies/{movieId}/sheets/{sheetId} error', err)
    return c.text('Internal Server Error', 500)
  }
}

export const deleteSheet = async (c: Context) => {
  try {
    const { sheetId } = c.req.param()
    await service.deleteSheet(sheetId)
    return c.text('', 200)
  } catch (err) {
    console.error('DELETE /movies/{movieId}/sheets/{sheetId} error', err)
    return c.text('Internal Server Error', 500)
  }
}
