import * as Chance from 'chance';
import * as _ from 'lodash';
import { DateTime } from 'luxon';
import * as request from 'supertest';
import { EntityManager } from 'typeorm';
import App from '../../../app';
import { Movie } from '../../../entities/Movie';
import { User, UserRoles } from '../../../entities/User';
import { MovieFactory } from '../../../factories/MovieFactory';
import { ReviewFactory } from '../../../factories/ReviewFactory';
import { UserFactory } from '../../../factories/UserFactory';
import * as Encryption from '../../../utils/encryption';
import { ReviewResponse } from '../../review/reviewTypes';
import { MovieController } from '../movieController';

const app = new App([new MovieController()]);
const chance = new Chance();
const server = app.getServer();
let manager: EntityManager;

beforeAll(async () => {
    await app.listen();
    await app.databaseConnection.resetConnections();
    manager = app.getDatabaseManager();
});

beforeEach(async () => {
    await app.databaseConnection.resetConnections();
});

afterAll(async () => {
    await app.databaseConnection.resetConnections();
    await app.databaseConnection.closeConnection();
    await app.close();
});

describe('When sending a request', () => {
    let user: User;
    beforeEach(async () => {
        user = await UserFactory.createUser(
            {
                email: 'ivangarl@yopmail.com',
                role: UserRoles.USER,
                password: await Encryption.getHashedPassword('very-secret-password'),
            },
            manager,
        );

        jest.spyOn(Encryption, 'decodeToken').mockReturnValue({
            userId: user.id,
            role: UserRoles.USER,
            email: user.email,
            exp: DateTime.local().plus({ hours: 1 }).toJSDate(),
        });
    });
    describe('GET /movies, then', () => {
        test('it should return a list of movies', async () => {
            const movies = await Promise.all(
                _.range(100).map(async () => {
                    return await MovieFactory.createMovie({}, manager);
                }),
            );

            const response = await request(server).get('/movies');

            expect(response.error).toBeFalsy();
            expect(response.status).toBe(200);

            expect(response.body).toHaveProperty('movies');
            expect(response.body.movies).toHaveLength(10);
            expect(response.body.pages).toBe(10);
            response.body.movies.forEach((movie: Movie) => {
                const dbMovie = movies.find((m) => m.id === movie.id);
                expect(dbMovie).toBeDefined();
            });
        });
    });
    describe('GET /movies/:tmdbId/reviews, then', () => {
        test('it should return all reviews from a movie', async () => {
            const movie = await MovieFactory.createMovie(
                {
                    tmdbId: 888,
                    title: 'Batman: The Dark Knight',
                    overview:
                        'The Dark Knight of Gotham City begins his war on crime with his first major enemy being the clownishly homicidal Joker.',
                    releaseDate: DateTime.fromISO('2008-07-16').toJSDate(),
                },
                manager,
            );

            const reviews = await Promise.all(
                _.range(50).map(async () => {
                    try {
                        const user = await UserFactory.createUser(
                            {
                                email: chance.email(),
                                role: UserRoles.USER,
                                password: await Encryption.getHashedPassword('very-secret-password'),
                            },
                            manager,
                        );

                        return await ReviewFactory.createReview({}, user, movie, manager);
                    } catch (error) {
                        console.log('skiping user-review creation for error:', error);
                    }
                }),
            );

            const response = await request(server).get(`/movies/${movie.tmdbId}/reviews`);

            expect(response.error).toBeFalsy();
            expect(response.status).toBe(200);

            expect(response.body).toHaveProperty('reviews');
            expect(response.body.reviews).toHaveLength(10);
            expect(response.body.pages).toBe(5);
            response.body.reviews.forEach((review: ReviewResponse) => {
                const dbReview = reviews.find((r) => r.id === review.id);
                expect(dbReview).toBeDefined();
            });
        });
    });
});
