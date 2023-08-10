import { DateTime } from 'luxon';
import * as request from 'supertest';
import { EntityManager } from 'typeorm';
import App from '../../../app';
import { UserController } from '../userController';
import { User, UserRoles } from '../../../entities/User';
import * as Encryption from '../../../utils/encryption';
import { UserFactory } from '../../../factories/UserFactory';

const app = new App([new UserController()]);
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
});

describe('When sending a POST request to /users/register, then', () => {
    test('it should create a new user', async () => {
        const response = await request(app.getServer()).post('/users/register').send({
            username: 'ivangarl',
            email: 'ivangarl@yopmail.com',
            password: 'very-secret-password',
            passwordConfirmation: 'very-secret-password',
        });

        expect(response.error).toBeFalsy();
        expect(response.status).toBe(201);

        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('email');
        expect(response.body).toHaveProperty('role');
        expect(response.body.email).toBe('ivangarl@yopmail.com');
        expect(response.body.role).toBe(UserRoles.USER);

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
            email: 'ivangarl@yopmail.com',
            exp: DateTime.local().plus({ hours: 1 }).toJSDate(),
        });

        const response = await request(app.getServer()).post('/users/login').send({
            email: user.email,
            password,
        });

        expect(response.error).toBeFalsy();
        expect(response.status).toBe(200);
    });
});
