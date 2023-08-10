import App from './app';
import { UserController } from './services/user/userController';

const app = new App([new UserController()]);

app.listen();
app.getAvailableRoutes();