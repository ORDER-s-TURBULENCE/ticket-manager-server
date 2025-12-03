import { prisma } from '../lib/prisma.js';
import type { components } from '../types/api.js';

type MovieInput = components['schemas']['MovieInput'];

export const getMovies = async () => {
    try {
        const movies = await prisma.movie.findMany({
            orderBy: { created_at: 'desc' },
        });

        return movies;
    } catch (error) {
        console.error('getMovies error', error);
        throw error;
    }
};

export const postMovies = async (movie: MovieInput) => {
    try {
        await prisma.movie.create({
            data: {
                title: movie.title,
                onair: new Date(movie.onair),
            },
        });;
    } catch (error) {
        console.error('postMovies error', error);
        throw error;
    }
};
