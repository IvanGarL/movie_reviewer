import { UserRoles } from 'entities/User';
import { ReviewResponse } from '../review/reviewTypes';

/**
 * Payload for the User register request
 */
export interface UserSignUpRequest {
    username?: string;
    email: string;
    password: string;
    passwordConfirmation: string;
}

/**
 * Payload for the User logIn request
 */
export interface UserLogInRequest {
    email: string;
    password: string;
}

/**
 * Payload for the User register response
 */
export interface UserSignUpResponse {
    token: string;
    email: string;
    role: UserRoles;
}

/**
 * Response for the GET /users/{username}/reviews endpoint
 */
export interface UserReviewsResponse {
    id: string;
    username: string;
    email: string;
    role: UserRoles;
    reviews: ReviewResponse[];
    pages: number;
}
