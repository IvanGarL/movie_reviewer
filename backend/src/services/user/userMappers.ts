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
                  tmdbId: review.movieTmdbId,
                  title: review.movie.title,
                  overview: review.movie.overview,
                  comment: review.comment,
                  rating: review.rating,
                  createdAt: review.createdAt,
                  updatedAt: review.updatedAt,
              }))
            : [],
        pages,
    };
};