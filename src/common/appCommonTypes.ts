import { Router } from 'express';
import { MovieController } from '../services/movie/movieController';
import { ReviewController } from '../services/review/reviewController';
import { UserController } from '../services/user/userController';

export enum AppService {
    USER = 'user',
    MOVIE = 'movie',
    REVIEW = 'review',
}

export type AppController = {
    [AppService.USER]: UserController;
    [AppService.MOVIE]: MovieController;
    [AppService.REVIEW]: ReviewController;
};

export interface Controller {
    path: string;
    router: Router;
    service: AppService;
    initializeRoutes(): void;
    getAvailableRoutes(): void;
}
