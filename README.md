# movie_reviewer
NodeJS server that fetch [The Movie DB](https://developer.themoviedb.org/reference/intro/getting-started) API information and post reviews in postgres database.

Tools used to implement the solution
- Express: expose the BackEnd server APIs with a routing framework built-in the library.  
- TypeORM: implement the relational database schema in the application layer supported on the ORM features.  
- PostgreSQL: relational database system.  
- Axios: external REST request tool.  
- Bcrypt: cyphering library.
- JWT: used to handle authentication and authorization of the BackEnd APIs
- Joi: helps to run REST request body and query-params validations.
- Jest: integrates with ts-jest for the implementation of the unit tests.

Instructions to run the server

- Deploy on local machine.  

    1.1 Connect your local machine to a postgres db-server.  
    1.2 Create a new connection in localhost that follows the ```./ormconfig.ts``` configuration.  
    1.3 Create a new database with name ```db``` and another with the name ```db_test``` for the integration test.   
    1.4 Install the dependencies and devDependencies and to start the server wheter for production or development, run:    
        
        npm install 
        
        npm run start[:dev]
           
- Deploy with docker.  
    just run ```docker-compose up -d``` in terminal in the root directory

- Docs:  
    1. Theres the option of exploring the services using the Postman collection available in the root directory. Import the file 'Movie reviewer.postman_collection.json' to postman and create a new env variable called ```basicUrl``` with the value of 'http://localhost:8080'.
    
    2. All the code is documented in ```./docs/index.html```
    3. The API REST docs is available in github-pages in this link: https://ivangarl.github.io/web-scraper/
    
- Test:
    Run the test suite running: ```npm run test```