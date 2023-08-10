import 'dotenv/config';
import * as express from 'express';
import { EntityManager } from 'typeorm';
import { DatabaseConnection } from './database/db';
import errorMiddleware from './middlewares/error.middleware';
import Controller from './common/serviceCommonTypes';
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

    private initializeMiddlewares() {
        this.app.use(require('cors')());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private initializeRoutes(controllers: Controller[]) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }

    private async initializeConnection() {
        try {
            this.databaseConnection = await DatabaseConnection.getInstance();
        } catch (error) {
            console.log('Error connecting to db', error);
        }
    }

    public async listen() {
        await this.initializeConnection();
        this.app.listen(this.port, () => {
            console.log(`🚀 App listening on the port ${this.port}`);
        });
    }

    public getServer(): express.Application {
        return this.app;
    }

    public getDatabaseManager(): EntityManager {
        return this.databaseConnection.getConnectionManager();
    }

    public getAvailableRoutes(): void {
        this.controllers.forEach((controller) => {
            controller.getAvailableRoutes();
        });
    }
}

export default App;
