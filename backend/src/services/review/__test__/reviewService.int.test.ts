import { DateTime } from 'luxon';
import * as request from 'supertest';
import { EntityManager } from 'typeorm';
import App from '../../../app';
import { AppServicePath } from '../../../common/appCommonTypes';
import { Review } from '../../../entities/Review';
import { User, UserRoles } from '../../../entities/User';
import { MovieFactory } from '../../../factories/MovieFactory';
import { ReviewFactory } from '../../../factories/ReviewFactory';
import { UserFactory } from '../../../factories/UserFactory';
import * as Encryption from '../../../utils/encryption';
import { ReviewController } from '../reviewController';

const app = new App([new ReviewController()]);
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
    describe('POST /reviews, then', () => {
        test('it should save in the database the review information', async () => {
            const movie = await MovieFactory.createMovie(
                {
                    title: 'The Matrix',
                    releaseDate: DateTime.fromISO('1999-03-31').toJSDate(),
                    overview:
                        'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
                },
                manager,
            );

            const response = await request(server).post(AppServicePath.REVIEW).send({
                tmdbId: movie.tmdbId,
                userName: user.username,
                rating: 9.8,
                comment: 'This is a comment',
            });

            expect(response.error).toBeFalsy();
            expect(response.status).toBe(201);

            expect(response.body.message).toBe('Review created successfully');
            expect(response.body.review).toBeDefined();
            expect(response.body.review.tmdbId).toBe(movie.tmdbId);
            expect(response.body.review.username).toBe(user.username);

            const review = await manager.findOne(Review, {
                where: { movieTmdbId: movie.tmdbId, username: user.username },
            });

            expect(review).toBeDefined();
            expect(review.movieTmdbId).toBe(movie.tmdbId);
            expect(review.username).toBe(user.username);
            expect(review.rating).toBe(9.8);
            expect(review.comment).toBe('This is a comment');
        });
        test('if the user has already reviewed the movie, it should update the review', async () => {
            const movie = await MovieFactory.createMovie(
                {
                    title: 'The Matrix',
                    releaseDate: DateTime.fromISO('1999-03-31').toJSDate(),
                    overview:
                        'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
                },
                manager,
            );

            await ReviewFactory.createReview(
                {
                    movieTmdbId: movie.tmdbId,
                    username: user.username,
                    rating: 2.0,
                    comment: 'Meh',
                },
                user,
                movie,
                manager,
            );

            const response = await request(server).post(AppServicePath.REVIEW).send({
                tmdbId: movie.tmdbId,
                userName: user.username,
                rating: 9.8,
                comment: 'Awesome movie!',
            });

            expect(response.error).toBeFalsy();
            expect(response.status).toBe(200);

            expect(response.body.message).toBe('Review updated successfully');

            const review = await manager.findOne(Review, {
                where: { movieTmdbId: movie.tmdbId, username: user.username },
            });

            expect(review).toBeDefined();
            expect(review.movieTmdbId).toBe(movie.tmdbId);
            expect(review.username).toBe(user.username);
            expect(review.rating).toBe(9.8);
            expect(review.comment).toBe('Awesome movie!');
        });
    });
});
