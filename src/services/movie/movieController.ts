import { Router } from 'express';
import { AppService, AppServicePath, Controller } from '../../common/appCommonTypes';
import { TheMovieDBAPIClient } from '../../utils/tmdb';
import MovieService from './movieService';

export enum MovieRoutes {
    GET_MOVIE_REVIEWS = '/:tmdbId/reviews',
}

export class MovieController implements Controller {
    path: string;
    router: Router;
    service: AppService;
    private movieService: MovieService;

    constructor() {
        this.path = AppServicePath.MOVIE;
        this.service = AppService.MOVIE;
        this.router = Router();
        this.movieService = new MovieService();
        this.initializeRoutes();
    }

    /**
     * Loads movies to the database
     * @param {TheMovieDBAPIClient} tmdbClient the client to use to fetch the movies from the API
     * @param {number} pagesToLoad number of pages to fetch from the API and load to the database
     */
    public async loadMovies(tmdbClient: TheMovieDBAPIClient, pagesToLoad: number): Promise<void> {
        await tmdbClient.getApiConfiguration();
        await this.movieService.loadMoviesToDB(tmdbClient, pagesToLoad);
    }

    /**
     * Initializes the routes
     */
    public initializeRoutes(): void {
        this.router.get(this.path.concat(MovieRoutes.GET_MOVIE_REVIEWS), this.movieService.getMovieReviews);
    }

    /**
     * Prints the available routes
     */
    public getAvailableRoutes(): void {
        console.log('\nMovie routes available:');
        this.router.stack.forEach(({ route }) => {
            const [availableRoute] = Object.keys(route.methods).map((method) =>
                '- '.concat(method.toUpperCase()).concat(' ').concat(route.path),
            );
            console.log(availableRoute);
        });
    }
}
