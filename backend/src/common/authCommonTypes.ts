import { UserRoles } from 'entities/User';
import { Request } from 'express';

/**
 * Properties of the Decoded token
 * for authentication
 */
export interface DecodedToken {
    userId: string;
    email: string;
    role: UserRoles;
    exp: Date;
}

/**
 * Authenticated request
 */
export interface AuthRequest extends Request {
    decodedToken?: DecodedToken;
}
