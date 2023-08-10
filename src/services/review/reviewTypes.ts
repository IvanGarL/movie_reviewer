/**
 * Response for the POST /reviews endpoint
 */
export interface SubmitReviewResponse {
    message: string;
    review: {
        id: string;
        tmdbId: number;
        username: string;
        rating: number;
        comment: string;
        createdAt: Date;
        updatedAt: Date;
    };
}
