import App from './app';
import { MovieController } from './services/movie/movieController';
import { UserController } from './services/user/userController';

const app = new App([new UserController(), new MovieController()]);

app.getMovieController().loadMovies(app.tmdbClient);
app.getAvailableRoutes();
app.listen();
