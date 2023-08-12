import { Review } from '../../entities/Review';
import { SubmitReviewResponse } from './reviewTypes';

/**
 * Maps a Review entity to a Review object
 * @param review
 * @returns
 */
export const mapReview = (message: string, review: Review): SubmitReviewResponse => {
    return {
        message,
        review: {
            id: review.id,
            tmdbId: review.movieTmdbId,
            username: review.username,
            rating: review.rating,
            comment: review.comment,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
        },
    }
};
