import { Router } from 'express';
import Controller from '../../common/serviceCommonTypes';
import UsersService from './userService';

enum UserRoutes {
    REGISTER = '/register',
    LOGIN = '/logIn',
}

export class UserController implements Controller {
    path: string;
    router: Router;
    needsTmdbClient: boolean;
    private usersService: UsersService;

    constructor() {
        this.path = '/users'
        this.needsTmdbClient = false;
        this.router = Router();
        this.usersService = new UsersService();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(this.path.concat(UserRoutes.REGISTER), this.usersService.register);
        this.router.post(this.path.concat(UserRoutes.LOGIN), this.usersService.logIn);
    }

    public getAvailableRoutes(): void {
        console.log('User routes availables:');
        this.router.stack.forEach(({route}) => {
            const [availableRoute] = Object.keys(route.methods).map(method => '- '.concat(method.toUpperCase()).concat(' ').concat(route.path));
            console.log(availableRoute);
        });
    }
}