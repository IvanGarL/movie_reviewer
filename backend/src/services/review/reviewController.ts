import { Router } from 'express';
import { AppService, AppServicePath, Controller } from '../../common/appCommonTypes';
import ReviewService from './reviewService';

export class ReviewController implements Controller {
    path: string;
    router: Router;
    service: AppService;
    private reviewService: ReviewService;

    constructor() {
        this.path = AppServicePath.REVIEW;
        this.service = AppService.REVIEW;
        this.router = Router();
        this.reviewService = new ReviewService();
        this.initializeRoutes();
    }

    /**
     * Initializes the routes
     */
    public initializeRoutes(): void {
        this.router.post(this.path, this.reviewService.submitReview);
    }

    /**
     * Prints the available routes
     */
    public getAvailableRoutes(): void {
        console.log('\nReview routes available:');
        this.router.stack.forEach(({ route }) => {
            const [availableRoute] = Object.keys(route.methods).map((method) =>
                '- '.concat(method.toUpperCase()).concat(' ').concat(route.path),
            );
            console.log(availableRoute);
        });
    }
}
