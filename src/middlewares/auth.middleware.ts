import { Response } from 'express';
import * as J from 'joi';
import { EntityManager } from 'typeorm';
import { DatabaseConnection } from '../database/db';
import { UserRoles } from '../entities/User';
import { AuthRequest, DecodedToken } from '../common/authCommonTypes';
import { decodeToken } from '../utils/encryption';
import HttpError from '../utils/exception';

/**
 * Middleware options
 */
interface MiddlewareOptions {
    bodyValidation?: J.ObjectSchema;
    queryValidation?: J.ObjectSchema;
    roles?: UserRoles[];
    validateToken: boolean;
    handler: (req: AuthRequest, res: Response, db: EntityManager) => Promise<any>;
}

/**
 * Validate the role for a requested service
 * @param allowedRoles Allowed roles to access a service
 * @param userRole role of the user trying to access
 */
const validateRoles = (allowedRoles: UserRoles[], userRole: UserRoles) => {
    const isAllowed = allowedRoles.find((r) => r === userRole);
    if (!isAllowed) throw new HttpError(403, 'Forbidden access to this service for this user');
};

/**
 * Wraps the business logic executed for a specific service in the server
 * Connects to the database and makes user-authentication
 * @param {AuthRequest} req
 * @param {Response} res
 * @param {Middleware} middleware
 */
export const middleware = async (req: AuthRequest, res: Response, middlewareOptions: MiddlewareOptions) => {
    // validate token and role
    const token = req.headers.authorization;
    const { validateToken, roles, bodyValidation, queryValidation, handler } = middlewareOptions;
    if (token || validateToken) {
        let decodedToken: DecodedToken;
        try {
            decodedToken = decodeToken(token);
            req.decodedToken = decodedToken;
        } catch (error) {
            console.error('Error authenticating user', error);
            return res.status(401).send({ error: 'Error authenticating user '.concat(error) });
        }
        if (roles) {
            const userRole = decodedToken.role;
            try {
                validateRoles(roles, userRole);
            } catch (error) {
                console.error('Error authenticating user', error);
                return res.status(error.status).send({ error: error.message });
            }
        }
    }

    // validate body
    if (bodyValidation) {
        const { error } = bodyValidation.validate(req.body);
        if (error) return res.status(400).send({ error: 'Request body Validation Error\n'.concat(error.message) });
    }
    // validate queryParams
    if (queryValidation) {
        const { error } = queryValidation.validate(req.query);
        if (error)
            return res.status(400).send({ error: 'Request query params Validation Error\n'.concat(error.message) });
    }
    console.log(req.hostname, req.originalUrl, req.path, req.body, req.method, req.headers);

    // connect to dabatase
    let manager: EntityManager;
    try {
        const connection = await DatabaseConnection.getInstance();
        manager = connection.getConnectionManager();
    } catch (e) {
        console.error('Error connecting to database', e);
        return res.status(e.status ? e.status : 500).send({ error: e.message });
    }

    // run service after validations
    return await handler(req, res, manager).catch((error: HttpError) => {
        console.error(error);
        res.status(error.status ?? 500).send({ error: error.message });
    });
};
