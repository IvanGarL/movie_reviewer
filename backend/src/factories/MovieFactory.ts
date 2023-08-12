import * as Chance from 'chance';
import { EntityManager } from 'typeorm';
import { Movie } from '../entities/Movie';

export class MovieFactory {
    private static chance = new Chance();

    /**
     * Creates a test movie
     * @param {Partial<Movie>} movie
     * @param {EntityManager} manager
     * @returns {Promise<Movie>}
     */
    public static async createMovie(movie: Partial<Movie>, manager?: EntityManager): Promise<Movie> {
        let newMovie = new Movie({
            tmdbId: movie.tmdbId ?? this.chance.integer({ min: 1, max: 1000000 }),
            title: movie.title ?? this.chance.name(),
            overview: movie.overview ?? this.chance.string(),
            posterPath: movie.posterPath ?? `https://image.tmdb.org/t/p/w500/${this.chance.string({ length: 10 })}.jpg`,
            releaseDate:
                movie.releaseDate ??
                new Date(this.chance.date({ year: this.chance.integer({ min: 1998, max: 2023 }) })),
        });

        Object.assign(newMovie, movie);
        if (manager) newMovie = await manager.save(Movie, newMovie);

        return newMovie;
    }
}
