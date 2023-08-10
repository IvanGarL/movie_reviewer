import { Router } from 'express';
import { MovieController } from '../services/movie/movieController';
import { ReviewController } from '../services/review/reviewController';
import { UserController } from '../services/user/userController';

/**
 * Available services in the app
 */
export enum AppService {
    USER = 'user',
    MOVIE = 'movie',
    REVIEW = 'review',
}

export enum AppServicePath {
    USER = '/users',
    MOVIE = '/movies',
    REVIEW = '/reviews',
}

/**
 * Respective controllers in the app for each service
 */
export type AppController = {
    [AppService.USER]: UserController;
    [AppService.MOVIE]: MovieController;
    [AppService.REVIEW]: ReviewController;
};

/**
 * Common interface for all controllers
 */
export interface Controller {
    path: string;
    router: Router;
    service: AppService;
    initializeRoutes(): void;
    getAvailableRoutes(): void;
}
