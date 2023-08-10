import * as _ from 'lodash';
import { In } from 'typeorm';
import { DatabaseConnection } from '../../database/db';
import { Movie } from '../../entities/Movie';
import { TheMovieDBAPIClient, TmdbMovie } from '../../utils/tmdb';
export default class MovieService {
    /**
     * 
     * @param tmdbClient 
     * @param pagesToLoad 
     */
    public async loadMoviesToDB(tmdbClient: TheMovieDBAPIClient, pagesToLoad: number): Promise<void> {
        console.log('Loading movies to DB...');
        const manager = (await DatabaseConnection.getInstance()).getConnectionManager();

        const tmdbMoviesMap = new Map<number, TmdbMovie>();
        await Promise.all(
            _.range(pagesToLoad).map(async (page: number) => {
                // each page has 20 movies
                const { results } = await tmdbClient.getPopularMovies({
                    params: { page: page + 1 },
                });

                results.forEach((movie: TmdbMovie) => {
                    tmdbMoviesMap.set(movie.id, movie);
                });
            }),
        );

        const dbMovies = await manager.find(Movie, {
            select: ['tmdbId'],
            where: { tmdbId: In([...tmdbMoviesMap.keys()]) },
        });
        dbMovies.forEach((dbMovie) => {
            tmdbMoviesMap.delete(dbMovie.tmdbId);
        });

        const moviesToInsert = [...tmdbMoviesMap.values()].map((tmdbMovie) => {
            return new Movie({
                tmdbId: tmdbMovie.id,
                title: tmdbMovie.title,
                overview: tmdbMovie.overview,
                posterPath: tmdbMovie.poster_path ? tmdbClient.getImgUrl(tmdbMovie.poster_path) : null,
                releaseDate: tmdbMovie.release_date ? new Date(tmdbMovie.release_date) : null,
            });
        });

        await manager.save(Movie, moviesToInsert);
    }
}
