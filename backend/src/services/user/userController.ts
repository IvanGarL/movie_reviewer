import { Router } from 'express';
import { AppService, AppServicePath, Controller } from '../../common/appCommonTypes';
import UsersService from './userService';

enum UserRoutes {
    REGISTER = '/register',
    LOGIN = '/logIn',
    GET_REVIEWS = '/:username/reviews',
}

export class UserController implements Controller {
    path: string;
    router: Router;
    service: AppService;
    protected usersService: UsersService;

    constructor() {
        this.path = AppServicePath.USER;
        this.service = AppService.USER;
        this.router = Router();
        this.usersService = new UsersService();
        this.initializeRoutes();
    }

    /**
     * Initializes the routes
     */
    public initializeRoutes() {
        this.router.post(this.path.concat(UserRoutes.REGISTER), this.usersService.register);
        this.router.post(this.path.concat(UserRoutes.LOGIN), this.usersService.logIn);
        this.router.get(this.path.concat(UserRoutes.GET_REVIEWS), this.usersService.getUserReviews);
    }

    /**
     * Prints the available routes
     */
    public getAvailableRoutes(): void {
        console.log('\nUser routes available:');
        this.router.stack.forEach(({ route }) => {
            const [availableRoute] = route.stack.map(({ method }) =>
                '- '.concat(method.toUpperCase()).concat(' ').concat(route.path),
            );
            console.log(availableRoute);
        });
    }
}
