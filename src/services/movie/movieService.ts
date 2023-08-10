import * as _ from 'lodash';
import { In } from 'typeorm';
import { DatabaseConnection } from '../../database/db';
import { Movie } from '../../entities/Movie';
import { TheMovieDBAPIClient, TmdbMovie } from '../../utils/tmdb';
export default class MovieService {
    public async loadMoviesToDB(tmdbClient: TheMovieDBAPIClient): Promise<void> {
        const manager = (await DatabaseConnection.getInstance()).getConnectionManager();

        const tmdbMoviesMap = new Map<number, TmdbMovie>();
        _.range(50).forEach(async (page: number) => {
            // each page has 20 movies
            const { results } = await tmdbClient.getPopularMovies({
                params: { page },
            });

            results.forEach((movie: TmdbMovie) => {
                tmdbMoviesMap.set(movie.id, movie);
            });
        });

        const dbMovies = await manager.find(Movie, { where: { tmdbId: In([...tmdbMoviesMap.keys()]) } });
        dbMovies.forEach((dbMovie) => {
            tmdbMoviesMap.delete(dbMovie.tmdbId);
        });

        const moviesToInsert = [...tmdbMoviesMap.values()].map((tmdbMovie) => {
            return new Movie({
                tmdbId: tmdbMovie.id,
                title: tmdbMovie.title,
                overview: tmdbMovie.overview,
                posterPath: tmdbClient.getImgUrl(tmdbMovie.poster_path),
                releaseDate: new Date(tmdbMovie.release_date),
            });
        });

        await manager.save(Movie, moviesToInsert);
    }
}
