import { Router } from 'express';
import { EntityManager } from 'typeorm';
import Controller from '../../common/serviceCommonTypes';
import { TheMovieDBAPIClient } from '../../utils/tmdb';
import MovieService from './movieService';

export class MovieController implements Controller {
    path: string;
    router: Router;
    needsTmdbClient: boolean;
    private movieService: MovieService;

    constructor() {
        this.path = '/users';
        this.needsTmdbClient = true;
        this.router = Router();
        this.movieService = new MovieService();
        this.initializeRoutes();
    }

    public async loadMovies(tmdbClient: TheMovieDBAPIClient): Promise<void> {
        await this.movieService.loadMoviesToDB(tmdbClient);
    }

    public initializeRoutes(): void {}

    public getAvailableRoutes(): void {
        console.log('Movie routes availables:');
        this.router.stack.forEach(({ route }) => {
            const [availableRoute] = Object.keys(route.methods).map((method) =>
                '- '.concat(method.toUpperCase()).concat(' ').concat(route.path),
            );
            console.log(availableRoute);
        });
    }
}
