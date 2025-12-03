import { prisma } from '../lib/prisma.js'
import type { components } from '../types/api.js'

type SheetInput = components['schemas']['SheetInput']

export const getSheetsByMovie = async (movieId: string) => {
  return prisma.sheet.findMany({ where: { movie_id: movieId }, orderBy: { row: 'asc', col: 'asc' } })
}

export const postSheetForMovie = async (movieId: string, input: SheetInput) => {
  await prisma.sheet.create({ data: { ...input, movie_id: movieId } as any })
}

export const getSheet = async (id: string) => prisma.sheet.findUnique({ where: { id } })

export const deleteSheet = async (id: string) => prisma.sheet.delete({ where: { id } })
