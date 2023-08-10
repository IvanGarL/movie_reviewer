import { Router } from 'express';
import { AppService, Controller } from '../../common/appCommonTypes';
import ReviewService from './reviewService';

export class ReviewController implements Controller {
    path: string;
    router: Router;
    service: AppService;
    private reviewService: ReviewService;

    constructor() {
        this.path = '/reviews';
        this.router = Router();
        this.service = AppService.REVIEW;
        this.reviewService = new ReviewService();
        this.initializeRoutes();
    }

    public initializeRoutes(): void {
        this.router.post(this.path, this.reviewService.submitReview);
    }

    public getAvailableRoutes(): void {
        console.log('Review routes available:');
        this.router.stack.forEach(({ route }) => {
            const [availableRoute] = Object.keys(route.methods).map((method) =>
                '- '.concat(method.toUpperCase()).concat(' ').concat(route.path),
            );
            console.log(availableRoute);
        });
    }
}
