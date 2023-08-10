import { Request, Response } from 'express';
import * as J from 'joi';
import { EntityManager } from 'typeorm';
import { AuthRequest } from '../../common/authCommonTypes';
import { middleware } from '../../middlewares/auth.middleware';
import { User, UserRoles } from '../../entities/User';
import { getHashedPassword, generateJWT, passwordMatch } from '../../utils/encryption';
import HttpError from '../../utils/exception';
import { UserSignUpRequest, UserLogInRequest } from './userTypes';

export default class UsersService {
    /**
     * @api {POST} /users/register Registers a new user
     * @apiName RegisterUser
     * @apiGroup Auth
     * @apiVersion  1.0.0
     * @apiPermission PUBLIC
     * @apiParam  {String} [name] User name
     * @apiParam  {String} [email] User email
     * @apiParam  {String} [password] User password
     * @apiParam  {String} [passwordConfirmation] User password confirmation
     * @apiParam  {String} [role] User role
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
    register = async (req: AuthRequest, res: Response): Promise<void> => {
        const signUpValidationSchema = J.object({
            name: J.string().optional(),
            email: J.string().email().required(),
            password: J.string().min(10).required(),
            passwordConfirmation: J.string().min(10).required(),
        });
        return middleware(req, res, {
            bodyValidation: signUpValidationSchema,
            validateToken: false,
            handler: async (req: Request, res: Response, manager: EntityManager) => {
                let newUser: User;
                let token: string;
                try {
                    const { name, email, password, passwordConfirmation }: UserSignUpRequest = req.body;

                    if (password !== passwordConfirmation) throw new HttpError(400, 'Passwords dont match');

                    const existingUser = await manager.findOne(User, { where: { email } });

                    if (existingUser) {
                        throw new HttpError(409, `A user with the email ${email} already exists`);
                    }

                    await manager.transaction(async (tmanager) => {
                        const hashPassword = await getHashedPassword(password);
                        newUser = new User({
                            name: name ? name.trim() : null,
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
    };

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
    logIn = async (req: AuthRequest, res: Response) => {
        const logInValidationSchema = J.object({
            email: J.string().email().required(),
            password: J.string().min(10).required(),
        });
        return middleware(req, res, {
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
    };
}
