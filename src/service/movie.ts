import { prisma } from '../../lib/prisma.js';
import type { components } from '../types/api.js';

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

type MovieInput = components['schemas']['MovieInput'];
export const postMovies = async (movie: MovieInput) => {
    try {
        const newMovie = await prisma.movie.create({
            data: {
                title: movie.title,
                onair: new Date(movie.onair),
            },
        });

        return newMovie;
    } catch (error) {
        console.error('postMovies error', error);
        throw error;
    }
};
