import type { Context } from 'hono'
import * as service from '../../service/api/form.js'

export const getForms = async (c: Context) => {
  const page = Number(c.req.query('page') ?? 1)
  const limit = Number(c.req.query('limit') ?? 20)
  try {
    const res = await service.getForms(page, limit)
    return c.json(res)
  } catch (err) {
    console.error('GET /forms error', err)
    return c.text('Internal Server Error', 500)
  }
}

export const postForm = async (c: Context) => {
  try {
    const payload = await c.req.json()
    await service.postForm(payload)
    return c.text('Created', 201)
  } catch (err) {
    console.error('POST /forms error', err)
    return c.text('Internal Server Error', 500)
  }
}

export const getFormById = async (c: Context) => {
  try {
    const { formId } = c.req.param()
    const form = await service.getFormById(formId)
    if (!form) return c.text('Not Found', 404)
    return c.json(form)
  } catch (err) {
    console.error('GET /forms/{id} error', err)
    return c.text('Internal Server Error', 500)
  }
}

export const putForm = async (c: Context) => {
  try {
    const { formId } = c.req.param()
    const payload = await c.req.json()
    await service.putForm(formId, payload)
    return c.text('Updated', 200)
  } catch (err) {
    console.error('PUT /forms/{id} error', err)
    return c.text('Internal Server Error', 500)
  }
}

export const deleteForm = async (c: Context) => {
  try {
    const { formId } = c.req.param()
    await service.deleteForm(formId)
    return c.text('', 200)
  } catch (err) {
    console.error('DELETE /forms/{id} error', err)
    return c.text('Internal Server Error', 500)
  }
}
