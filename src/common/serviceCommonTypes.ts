import { Router } from 'express';

export enum AppService {
    USER = 'user',
    MOVIE = 'movie',
    REVIEW = 'review',
}

export default interface Controller {
    path: string;
    router: Router;
    needsTmdbClient: boolean;
    getAvailableRoutes(): void;
}