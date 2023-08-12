/**
 * Review object sent in the response body
 */
export interface ReviewResponse {
    id: string;
    tmdbId?: number;
    username?: string;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Response for the POST /reviews endpoint
 */
export interface SubmitReviewResponse {
    message: string;
    review: ReviewResponse;
}
