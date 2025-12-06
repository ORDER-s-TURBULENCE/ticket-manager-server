import { MAX_SEATS } from '../../lib/constant.js'
import { prisma } from '../../lib/prisma.js'
import type { components } from '../../types/api.js'

type TicketInput = components['schemas']['TicketInput']
type TicketPurpose = components['schemas']['TicketPurpose']

export const getTickets = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit
  const [total, tickets] = await Promise.all([
    prisma.ticket.count(),
    prisma.ticket.findMany({ skip, take: limit, orderBy: { created_at: 'desc' } }),
  ])

  return { page, limit, total, tickets }
}

export const getTicketById = async (id: string) => {
  return prisma.ticket.findUnique({ where: { id } })
}

export const getTicketsByFormId = async (form_id: string) => {
  return prisma.ticket.findMany({ where: { form_id } })
}

export const getNumberOfTicketsForPurpose = async (movie_id: string) => {
  const number_of_seat_tickets = await prisma.ticket.count({ 
    where: {
      movie_id,
      purpose: 'seat',
      is_deleted: false,
    }
  })
  const number_of_goods_tickets = await prisma.ticket.count({ 
    where: {
      movie_id,
      purpose: 'goods',
      is_deleted: false,
    }
  })
  return {
    seat: number_of_seat_tickets,
    goods: number_of_goods_tickets,
    max_seats: MAX_SEATS,
  }
}

export const putTicket = async (id: string, input: TicketInput) => {
  await prisma.ticket.update({ where: { id }, data: input })
}

export const deleteTicket = async (id: string) => {
  await prisma.ticket.update({ where: { id }, data: { is_deleted: true } })
}

export const createTicketsByForm = async (form_id: string) => {
  const form = await prisma.form.findUnique({ where: { id: form_id } })
  if (!form) throw new Error('form_not_found')

  await prisma.$transaction(async (tx) => {
    const toCreatd: TicketInput[] = []
    for (let i = 0; i < form.number_of_seat_tickets; i++) {
        toCreatd.push({ 
            form_id: form.id, 
            movie_id: form.movie_id,
            purpose: 'seat' as TicketPurpose,
            is_activated: false,
            is_used: false,
        })
    }
    for (let i = 0; i < form.number_of_goods_tickets; i++) {
        toCreatd.push({ 
            form_id: form.id, 
            movie_id: form.movie_id,
            purpose: 'goods' as TicketPurpose,
            is_activated: false,
            is_used: false,
        })
    }
    await tx.ticket.createMany({ data: toCreatd })
  })
}
