import { Router } from 'express';
import { AppService, Controller } from '../../common/appCommonTypes';
import { TheMovieDBAPIClient } from '../../utils/tmdb';
import MovieService from './movieService';

export class MovieController implements Controller {
    path: string;
    router: Router;
    service: AppService;
    private movieService: MovieService;

    constructor() {
        this.path = '/movies';
        this.router = Router();
        this.service = AppService.MOVIE;
        this.movieService = new MovieService();
        this.initializeRoutes();
    }

    public async loadMovies(tmdbClient: TheMovieDBAPIClient, pagesToLoad: number): Promise<void> {
        await this.movieService.loadMoviesToDB(tmdbClient, pagesToLoad);
    }

    public initializeRoutes(): void {}

    public getAvailableRoutes(): void {
        console.log('\nMovie routes availables:');
        this.router.stack.forEach(({ route }) => {
            const [availableRoute] = Object.keys(route.methods).map((method) =>
                '- '.concat(method.toUpperCase()).concat(' ').concat(route.path),
            );
            console.log(availableRoute);
        });
    }
}
