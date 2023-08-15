import * as _ from 'lodash';
import { DateTime } from 'luxon';
import * as request from 'supertest';
import { EntityManager } from 'typeorm';
import App from '../../../app';
import { User, UserRoles } from '../../../entities/User';
import { MovieFactory } from '../../../factories/MovieFactory';
import { ReviewFactory } from '../../../factories/ReviewFactory';
import { UserFactory } from '../../../factories/UserFactory';
import * as Encryption from '../../../utils/encryption';
import { ReviewResponse } from '../../review/reviewTypes';
import { UserController } from '../userController';

const app = new App([new UserController()]);
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

describe('When sending a POST request to /users/register, then', () => {
    test('it should create a new user', async () => {
        const response = await request(server).post('/users/register').send({
            username: 'ivangarl',
            email: 'ivangarl@yopmail.com',
            password: 'very-secret-password',
            passwordConfirmation: 'very-secret-password',
        });

        expect(response.error).toBeFalsy();
        expect(response.status).toBe(201);

        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('email');
        expect(response.body.email).toBe('ivangarl@yopmail.com');

        const user = await manager.findOne(User, { where: { email: 'ivangarl@yopmail.com' } });
        expect(user).toBeDefined();
        expect(user.username).toBe('ivangarl');
        expect(user.email).toBe('ivangarl@yopmail.com');
        expect(user.role).toBe(UserRoles.USER);
    });
});

describe('When sending a POST request to /users/login, then', () => {
    test('it should log in a user', async () => {
        const password = 'very-secret-password';
        const user = await UserFactory.createUser(
            {
                email: 'ivangarl@yopmail.com',
                role: UserRoles.USER,
                password: await Encryption.getHashedPassword(password),
            },
            manager,
        );

        jest.spyOn(Encryption, 'decodeToken').mockReturnValue({
            userId: user.id,
            role: UserRoles.USER,
            email: user.email,
            exp: DateTime.local().plus({ hours: 1 }).toJSDate(),
        });

        const response = await request(server).post('/users/login').send({
            email: user.email,
            password,
        });

        expect(response.error).toBeFalsy();
        expect(response.status).toBe(200);

        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('email');
    });
});

describe('When sending a GET request to /users/:username/reviews, then', () => {
    test('it should return all reviews from a user', async () => {
        const password = 'very-secret-password';
        const user = await UserFactory.createUser(
            {
                email: 'ivangarl@yopmail.com',
                role: UserRoles.USER,
                password: await Encryption.getHashedPassword(password),
            },
            manager,
        );

        // create movies and reviews
        const reviews = await Promise.all(
            _.range(50).map(async () => {
                const movie = await MovieFactory.createMovie({}, manager);
                return await ReviewFactory.createReview({}, user, movie, manager);
            }),
        );

        jest.spyOn(Encryption, 'decodeToken').mockReturnValue({
            userId: user.id,
            role: UserRoles.USER,
            email: user.email,
            exp: DateTime.local().plus({ hours: 1 }).toJSDate(),
        });

        const response = await request(server).get(`/users/${user.username}/reviews`);

        expect(response.error).toBeFalsy();
        expect(response.status).toBe(200);

        expect(response.body.reviews).toHaveLength(10);
        expect(response.body.id).toBe(user.id);
        expect(response.body.username).toBe(user.username);
        expect(response.body.email).toBe(user.email);
        expect(response.body.role).toBe(user.role);
        expect(response.body.pages).toBe(5);
        response.body.reviews.forEach((review: ReviewResponse) => {
            const dbReview = reviews.find((r) => r.id === review.id);
            expect(dbReview).toBeDefined();
            expect(review.id).toBe(dbReview.id);
            expect(review.rating).toBe(dbReview.rating);
            expect(review.comment).toBe(dbReview.comment);
            expect(review.tmdbId).toBe(dbReview.movieTmdbId);
        });
    });
});
