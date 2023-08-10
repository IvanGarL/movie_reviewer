import { Router } from 'express';
import { AppService, Controller } from '../../common/appCommonTypes';
import UsersService from './userService';

enum UserRoutes {
    REGISTER = '/register',
    LOGIN = '/logIn',
}

export class UserController implements Controller {
    path: string;
    router: Router;
    service: AppService;
    protected usersService: UsersService;

    constructor() {
        this.path = '/users';
        this.service = AppService.USER;
        this.router = Router();
        this.usersService = new UsersService();
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.post(this.path.concat(UserRoutes.REGISTER), this.usersService.register);
        this.router.post(this.path.concat(UserRoutes.LOGIN), this.usersService.logIn);
    }

    public getAvailableRoutes(): void {
        console.log('\nUser routes available:');
        this.router.stack.forEach(({ route }) => {
            const [availableRoute] = Object.keys(route.methods).map((method) =>
                '- '.concat(method.toUpperCase()).concat(' ').concat(route.path),
            );
            console.log(availableRoute);
        });
    }
}
