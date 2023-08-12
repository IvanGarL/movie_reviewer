import { Request, Response } from 'express';
import * as J from 'joi';
import { EntityManager } from 'typeorm';
import { AuthRequest } from '../../common/authCommonTypes';
import { User, UserRoles } from '../../entities/User';
import { middleware } from '../../middlewares/auth';
import { generateJWT, getHashedPassword, passwordMatch } from '../../utils/encryption';
import HttpError from '../../utils/exception';
import { PaginationUtils } from '../../utils/pagination';
import { createUserReviewsQuery } from './userDatabase';
import { mapUserReviews } from './userMappers';
import { UserLogInRequest, UserSignUpRequest } from './userTypes';

export default class UsersService {
    /**
     * @api {POST} /users/register Registers a new user
     * @apiName RegisterUser
     * @apiGroup Auth
     * @apiVersion  1.0.0
     * @apiPermission PUBLIC
     * @apiParam  {String} [username] User name
     * @apiParam  {String} [email] User email
     * @apiParam  {String} [password] User password
     * @apiParam  {String} [passwordConfirmation] User password confirmation
     * @apiSuccess (201) {String} token JWT token
     * @apiSuccess (201) {String} email User email
     * @apiSuccess (201) {String} role User role
     * @apiError (400) {String} message Error registering user
     * @apiError (400) {String} message Passwords dont match
     * @apiError (400) {String} message User already exists
     * @apiError (500) {String} message Internal server error
     * @apiSuccessExample {json} Success-Response:
     * {
     *      "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9. ..."
     *      "email": "ivangarl@yopmail.com",
     *      "role": "USER"
     * }
     */
    public async register(req: AuthRequest, res: Response): Promise<void> {
        const signUpValidationSchema = J.object({
            username: J.string().required(),
            email: J.string().email().required(),
            password: J.string().min(10).required(),
            passwordConfirmation: J.string().min(10).required(),
        });
        return await middleware(req, res, {
            bodyValidation: signUpValidationSchema,
            validateToken: false,
            handler: async (req: Request, res: Response, manager: EntityManager) => {
                let newUser: User;
                let token: string;
                try {
                    const { username, email, password, passwordConfirmation }: UserSignUpRequest = req.body;

                    if (password !== passwordConfirmation) throw new HttpError(400, 'Passwords dont match');

                    const existingUser = await manager.findOne(User, { where: [{ email }, { username }] });

                    if (existingUser) {
                        throw new HttpError(409, `A user with the email ${email} or ${username} already exists`);
                    }

                    await manager.transaction(async (tmanager) => {
                        const hashPassword = await getHashedPassword(password);
                        newUser = new User({
                            username: username ? username.trim() : null,
                            email: email.toLowerCase(),
                            password: hashPassword,
                            role: UserRoles.USER,
                        });

                        newUser = await tmanager.save(newUser);
                        token = generateJWT(newUser);
                    });
                } catch (error) {
                    console.error('Error creating user', error);
                    throw new HttpError(error.status ?? 500, `Error creating user: ${error}`);
                }

                return res.status(201).send({
                    token,
                    email: newUser.email,
                    role: newUser.role,
                });
            },
        });
    }

    /**
     * @api {POST} /users/login Logs in a user
     * @apiName LogInUser
     * @apiGroup Auth
     * @apiVersion  1.0.0
     * @apiPermission PUBLIC
     * @apiParam  {String} email User email
     * @apiParam  {String} password User password
     * @apiSuccess (200) {String} token JWT token
     * @apiSuccess (200) {String} email User email
     * @apiError (400) {String} message Error logging in user
     * @apiError (404) {String} message User does not exist
     * @apiError (400) {String} message Passwords dont match
     * @apiError (500) {String} message Internal server error
     * @apiSuccessExample {json} Success-Response:
     * {
     *      "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9. ..."
     *      "email": "ivangarl@yopmail.com",
     * }
     */
    public async logIn(req: AuthRequest, res: Response): Promise<void> {
        const logInValidationSchema = J.object({
            email: J.string().email().required(),
            password: J.string().min(10).required(),
        });
        return await middleware(req, res, {
            bodyValidation: logInValidationSchema,
            validateToken: false,
            handler: async (req: Request, res: Response, manager: EntityManager) => {
                const { email, password }: UserLogInRequest = req.body;

                let user = await manager.findOne(User, {
                    where: { email: email.toLowerCase() },
                });

                if (!user) {
                    throw new HttpError(404, `User does not exist`);
                }

                passwordMatch(password, user.password);

                res.send({
                    token: generateJWT(user),
                    email: user.email,
                });
            },
        });
    }

    /**
     * @api {GET} /users/{username}/reviews Gets user reviews
     * @apiName GetUserReviews
     * @apiGroup Users
     * @apiVersion  1.0.0
     * @apiPermission USER
     * @apiParam  {String} username User name
     * @apiParam  {Number} [page] Page number
     * @apiSuccess (200) {Object[]} reviews User reviews
     * @apiSuccess (200) {String} reviews.id Review id
     * @apiSuccess (200) {String} reviews.title Review title
     * @apiSuccess (200) {String} reviews.content Review content
     * @apiSuccess (200) {String} reviews.rating Review rating
     * @apiSuccess (200) {String} reviews.createdAt Review creation date
     * @apiSuccess (200) {String} reviews.updatedAt Review update date
     * @apiSuccessExample {json} Success-Response:
     * {
     *     "id": "d538048b-7877-5580-863e-8848e2340710",
     *     "username": "ivangarl",
     *     "email": "ivangarl@yopmail.com",
     *     "role": "USER",
     *     "reviews": [
     *         {
     *             "id": "d538048b-7877-5580-863e-8848e2340710",
     *             "title": "Review title",
     *             "comment": "Review comment",
     *             "rating": 5,
     *             "createdAt": "2021-01-01T00:00:00.000Z",
     *             "updatedAt": "2021-01-01T00:00:00.000Z"
     *         }
     *     ]
     *     "pageCount": 1,
     *     "total: 1,
     * }
     */
    public async getUserReviews(req: AuthRequest, res: Response): Promise<void> {
        const getUserReviewsPathsValidationSchema = J.object({
            username: J.string().required(),
        });
        const getUserReviewsQueryValidationSchema = J.object({
            page: J.number().min(1).default(1).optional().allow(null),
        });
        return await middleware(req, res, {
            pathsValidation: getUserReviewsPathsValidationSchema,
            queryValidation: getUserReviewsQueryValidationSchema,
            roles: [UserRoles.USER],
            validateToken: true,
            handler: async (req: Request, res: Response, manager: EntityManager) => {
                if (!req.params?.username) throw new HttpError(400, 'username is required to get user reviews');
                const { params: {username }, query: { page } } = req;

                const user = await manager.findOne(User, { where: { username } });

                if (!user) throw new HttpError(404, `User ${username} not found`);

                const getUserReviewsQuery = createUserReviewsQuery(manager, username);
                const userReviews = await PaginationUtils.getPageOfQuery({
                    query: getUserReviewsQuery,
                    entityAlias: 'review',
                    orderingField: 'createdAt',
                    orderingDirection: 'DESC',
                    page: Number(page ?? 1),
                    pageSize: 10,
                });

                res.status(200).send(mapUserReviews(user, userReviews.currentPage, userReviews.pagesCount));
            },
        });
    }
}
