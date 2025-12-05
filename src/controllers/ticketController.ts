import type { Context } from 'hono'
import * as service from '../service/ticket.js'

export const getTickets = async (c: Context) => {
  const page = Number(c.req.query('page') ?? 1)
  const limit = Number(c.req.query('limit') ?? 20)
  try {
    const res = await service.getTickets(page, limit)
    return c.json(res)
  } catch (err) {
    console.error('GET /tickets error', err)
    return c.text('Internal Server Error', 500)
  }
}

export const getTicketsByFormId = async (c: Context) => {
  try {
    const { formId } = c.req.param()
    const t = await service.getTicketsByFormId(formId)
    if (!t) return c.text('Not Found', 404)
    return c.json(t)
  } catch (err) {
    console.error('GET /tickets/form/{formId} error', err)
    return c.text('Internal Server Error', 500)
  }
}

export const getTicketById = async (c: Context) => {
  try {
    const { ticketId } = c.req.param()
    const t = await service.getTicketById(ticketId)
    if (!t) return c.text('Not Found', 404)
    return c.json(t)
  } catch (err) {
    console.error('GET /tickets/{id} error', err)
    return c.text('Internal Server Error', 500)
  }
}

export const putTicket = async (c: Context) => {
  try {
    const { ticketId } = c.req.param()
    const payload = await c.req.json()
    await service.putTicket(ticketId, payload)
    return c.text('Updated', 200)
  } catch (err) {
    console.error('PUT /tickets/{id} error', err)
    return c.text('Internal Server Error', 500)
  }
}

export const deleteTicket = async (c: Context) => {
  try {
    const { ticketId } = c.req.param()
    await service.deleteTicket(ticketId)
    return c.text('', 200)
  } catch (err) {
    console.error('DELETE /tickets/{id} error', err)
    return c.text('Internal Server Error', 500)
  }
}
