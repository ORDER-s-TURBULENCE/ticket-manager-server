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
    if (err instanceof Error && err.message === "not_enough_seats") {
      return c.text('Not Enough Seats', 400);
    }
    if (err instanceof Error && err.message === "invalid_number_of_goods_tickets") {
      return c.text('Invalid Number of Goods Tickets', 400);
    }
    if (err instanceof Error && err.message === "invalid_number_of_seat_tickets") {
      return c.text('Invalid Number of Seat Tickets', 400);
    }
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
    if (err instanceof Error && err.message === "form_not_found") {
      return c.text('Form Not Found', 400);
    }
    if (err instanceof Error && err.message === "cannot_change_payment_method_from_square") {
      return c.text('Cannot Change Payment Method from Square', 400);
    }
    if (err instanceof Error && err.message === "cannot_change_payment_method_to_square") {
      return c.text('Cannot Change Payment Method to Square', 400);
    }
    if (err instanceof Error && err.message === "cannot_change_payment_status_of_square") {
      return c.text('Cannot Change Payment Status of Square', 400);
    }
    if (err instanceof Error && err.message === "cannot_change_payment_status_of_completed_form") {
      return c.text('Cannot Change Payment Status of Completed Form', 400);
    }
    if (err instanceof Error && err.message === "cannot_change_number_of_tickets") {
      return c.text('Cannot Change Number of Tickets', 400);
    }
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
