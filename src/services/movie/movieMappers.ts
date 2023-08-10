import { Movie } from '../../entities/Movie';
import { Review } from '../../entities/Review';
import { MovieReviewsResponse } from './movieTypes';

/**
 * Maps information from a movie and its reviews to a response
 * @param {Movie} movie
 * @param {Review[]} reviews
 * @returns {MovieReviewsResponse}
 */
export const mapMovieReviews = (movie: Movie, reviews: Review[], pages: number): MovieReviewsResponse => {
    return {
        id: movie.id,
        tmdbId: movie.tmdbId,
        title: movie.title,
        overview: movie.overview,
        posterPath: movie.posterPath,
        releaseDate: movie.releaseDate,
        reviews: reviews.length
            ? reviews.map((review) => ({
                  id: review.id,
                  comment: review.comment,
                  rating: review.rating,
                  username: review.username,
                  createdAt: review.createdAt,
                  updatedAt: review.updatedAt,
              }))
            : [],
        pageCount: reviews.length,
        pages,
    };
};
