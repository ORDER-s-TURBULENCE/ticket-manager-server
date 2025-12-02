import { prisma } from '../../lib/prisma.js'
import type { components } from '../types/api.js'

type FormInput = components['schemas']['FormInput']
type FormType = components['schemas']['FormType']

export const getForms = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit
  const [total, items] = await Promise.all([
    prisma.form.count(),
    prisma.form.findMany({ skip, take: limit, orderBy: { created_at: 'desc' } }),
  ])

  return { page, limit, total, users: items }
}

export const postForm = async (input: FormInput) => {
  await prisma.form.create({
    data: {
      name: input.name,
      email: input.email,
      movie_id: input.movie_id,
      type: input.type,
      is_verified: input.is_verified,
      payment_method: input.payment_method,
      payment_status: input.payment_status,
      number_of_tickets: input.number_of_tickets,
      number_of_seat_tickets: input.number_of_seat_tickets,
      remarks: input.remarks ?? null,
    },
  })
}

export const getFormById = async (id: string) => {
  return prisma.form.findUnique({ where: { id } })
}

export const putForm = async (id: string, input:  FormInput) => {
  await prisma.form.update({
    where: { id },
    data: {
      name: input.name,
      email: input.email,
      movie_id: input.movie_id,
      type: input.type,
      is_verified: input.is_verified,
      payment_method: input.payment_method,
      payment_status: input.payment_status,
      number_of_tickets: input.number_of_tickets,
      number_of_seat_tickets: input.number_of_seat_tickets,
      remarks: input.remarks ?? null,
    },
  })
}

export const deleteForm = async (id: string) => {
  await prisma.form.delete({ where: { id } })
}
