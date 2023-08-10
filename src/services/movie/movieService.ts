import { Response } from 'express';
import * as J from 'joi';
import * as _ from 'lodash';
import { EntityManager, In } from 'typeorm';
import { AuthRequest } from '../../common/authCommonTypes';
import { DatabaseConnection } from '../../database/db';
import { Movie } from '../../entities/Movie';
import { UserRoles } from '../../entities/User';
import { middleware } from '../../middlewares/auth';
import HttpError from '../../utils/exception';
import { TheMovieDBAPIClient, TmdbMovie } from '../../utils/tmdb';
import { mapMovieReviews } from './movieMappers';
export default class MovieService {
    /**
     * Loads movies to the database
     * @param {TheMovieDBAPIClient} tmdbClient the client to use to fetch the movies from the API
     * @param {number} pagesToLoad number of pages to fetch from the API and load to the database
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

        // Insert the movies to the database in batch
        await manager.save(Movie, moviesToInsert);
    }

    /**
     * @api {GET} /movies/:tmdbId/reviews Get movie details
     * @apiName GetMovieReviews
     * @apiGroup Movie
     * @apiDescription Get movie details and reviews
     * @apiParam {number} tmdbId The movie tmdbId
     * @apiSuccess {number} id The movie id
     * @apiSuccess {number} tmdbId The movie tmdbId
     * @apiSuccess {string} title The movie title
     * @apiSuccess {string} overview The movie overview
     * @apiSuccess {string} posterPath The movie poster path
     * @apiSuccess {Date} releaseDate The movie release date
     * @apiSuccess {Review[]} reviews The movie reviews
     * @apiSuccess {number} reviews.id The review id
     * @apiSuccess {string} reviews.author The review author
     * @apiSuccess {string} reviews.content The review content
     * @apiSuccess {string} reviews.url The review url
     * @apiSuccess {Date} reviews.createdAt The review creation date
     * @apiSuccess {Date} reviews.updatedAt The review update date
     * @apiSuccessExample {json} Success-Response:
     *    HTTP/1.1 200 OK
     *   {
     *      "id": "1",
     *      "tmdbId": 123,
     *      "title": "The Movie",
     *      "overview": "The movie overview",
     *      "posterPath": "https://image.tmdb.org/t/p/w500/abc.jpg",
     *      "releaseDate": "2020-01-01T00:00:00.000Z",
     *      "reviews": [ 
     *          {
     *              "id": "1",
     *              "comment": "The review comment",
     *              "rating": 5,
     *              "username": "John Doe",
     *              "createdAt": "2020-01-01T00:00:00.000Z",
     *              "updatedAt": "2020-01-01T00:00:00.000Z"
     *         }
     *      ]
     *   }
     */
    public async getMovieReviews(req: AuthRequest, res: Response): Promise<void> {
        const getMovieReviewsValidationSchema = J.object({
            tmdbId: J.number().min(1).required(),
        });
        return middleware(req, res, {
            pathsValidation: getMovieReviewsValidationSchema,
            roles: [UserRoles.USER],
            validateToken: true,
            handler: async (req: AuthRequest, res: Response, manager: EntityManager) => {
                if (!req.params?.tmdbId) throw new HttpError(400, 'tmdbId is required to get movie reviews');
                const { tmdbId } = req.params;

                const movieReviews = await manager.findOne(Movie, {
                    relations: ['reviews'],
                    where: { tmdbId: Number(tmdbId) },
                });

                if (!movieReviews) throw new HttpError(404, `Movie with tmdbId: ${tmdbId} not found`);

                res.status(200).send(mapMovieReviews(movieReviews));
            },
        });
    }
}
