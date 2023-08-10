import 'dotenv/config';
import App from './app';
import { AppService } from './common/appCommonTypes';
import { MovieController } from './services/movie/movieController';
import { ReviewController } from './services/review/reviewController';
import { UserController } from './services/user/userController';

const app = new App([new UserController(), new MovieController(), new ReviewController()]);

// IIFE to start the server
(async () => {
    // load movies to db
    // await app.getController(AppService.MOVIE).loadMovies(app.tmdbClient, Number(process.env.TMDB_MOVIE_PAGES));
    // start server
    await app.listen();
    // show available routes
    app.getAvailableRoutes();
})();
