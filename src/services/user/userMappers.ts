import { Review } from '../../entities/Review';
import { User } from '../../entities/User';
import { UserReviewsResponse } from './userTypes';

/**
 * Maps information from a user and its reviews to a response
 * @param {User} user
 * @param {Review[]} reviews
 * @returns {UserReviewsResponse}
 */
export const mapUserReviews = (user: User, reviews: Review[], pages: number): UserReviewsResponse => {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        reviews: reviews.length
            ? reviews.map((review) => ({
                  id: review.id,
                  comment: review.comment,
                  rating: review.rating,
                  tmdbId: review.movieTmdbId,
                  createdAt: review.createdAt,
                  updatedAt: review.updatedAt,
              }))
            : [],
        pageCount: reviews.length,
        pages,
    };
};