import { prisma } from '../../lib/prisma.js'
import type { components } from '../types/api.js'

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

export const postTicketsByForm = async (form_id: string) => {
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
    for (let i = 0; i < form.number_of_tickets - form.number_of_seat_tickets; i++) {
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

export const putTicket = async (id: string, input: TicketInput) => {
 await prisma.ticket.update({ where: { id }, data: input as any })
}

export const deleteTicket = async (id: string) => {
  await prisma.ticket.delete({ where: { id } })
}
