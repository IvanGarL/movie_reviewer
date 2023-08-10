import 'dotenv/config';
import * as express from 'express';
import { EntityManager } from 'typeorm';
import { AppController, AppService, Controller } from './common/appCommonTypes';
import { DatabaseConnection } from './database/db';
import errorMiddleware from './middlewares/error';
class App {
    public app: express.Application;
    public port: string | number;
    public databaseConnection: DatabaseConnection;
    public controllers: Controller[];

    constructor(controllers: Controller[]) {
        this.app = express();
        this.port = process.env.PORT || 8081;
        this.controllers = controllers;

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
            console.log(`\n🚀 App listening on the port ${this.port}`);
        });
    }

    public getController<S extends AppService>(service: S): AppController[S] {
        return this.controllers.find((controller) => controller.service === service) as AppController[S];
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
