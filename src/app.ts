import 'dotenv/config';
import * as express from 'express';
import { EntityManager } from 'typeorm';
import { DatabaseConnection } from './database/db';
import errorMiddleware from './middlewares/error';
import Controller, { AppService } from './common/serviceCommonTypes';
import { TheMovieDBAPIClient } from './utils/tmdb';
import { MovieController } from './services/movie/movieController';
class App {
    public app: express.Application;
    public port: string | number;
    public databaseConnection: DatabaseConnection;
    public controllers: Controller[];
    public tmdbClient: TheMovieDBAPIClient;

    constructor(controllers: Controller[]) {
        this.app = express();
        this.port = process.env.PORT || 8081;
        this.controllers = controllers;
        this.tmdbClient = new TheMovieDBAPIClient(process.env.TMDB_BASE_URL, process.env.TMDB_API_KEY, process.env.TMDB_GUEST_SESSION_ID);

        this.initializeMiddlewares();
        this.initializeErrorHandling();
        this.initializeRoutes(this.controllers);
    }

    /**
     * Initializes the middlewares
     */
    private initializeMiddlewares() {
        this.app.use(require('cors')());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    /**
     * Initializes the controllers
     * @param controllers 
     */
    private initializeRoutes(controllers: Controller[]) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }

    /**
     * Initializes the error handling
     */
    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }

    /**
     * Initializes the database connection
     */
    private async initializeConnection() {
        try {
            this.databaseConnection = await DatabaseConnection.getInstance();
        } catch (error) {
            console.log('Error connecting to db', error);
        }
    }

    /**
     * Starts the server
     */
    public async listen() {
        await this.initializeConnection();
        this.app.listen(this.port, () => {
            console.log(`🚀 App listening on the port ${this.port}`);
        });
    }

    public getMovieController(): MovieController {
        return this.controllers[AppService.MOVIE] as MovieController;
    }

    /**
     * Returns the server
     * @returns {express.Application}
     */
    public getServer(): express.Application {
        return this.app;
    }

    /**
     * Returns the database manager
     * @returns {EntityManager}
     */
    public getDatabaseManager(): EntityManager {
        return this.databaseConnection.getConnectionManager();
    }

    /**
     * Logs all the available routes
     */
    public getAvailableRoutes(): void {
        this.controllers.forEach((controller) => {
            controller.getAvailableRoutes();
        });
    }
}

export default App;
