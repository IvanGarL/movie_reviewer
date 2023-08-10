import { Movie } from '../../entities/Movie';
import { MovieReviewsResponse } from './movieTypes';

/**
 * Maps a Movie entity to a MovieReviewsResponse
 * @param {Movie} movie 
 * @returns {MovieReviewsResponse}
 */
export const mapMovieReviews = (movie: Movie): MovieReviewsResponse => {
    return {
        id: movie.id,
        tmdbId: movie.tmdbId,
        title: movie.title,
        overview: movie.overview,
        posterPath: movie.posterPath,
        releaseDate: movie.releaseDate,
        reviews: movie.reviews
            ? movie.reviews.map((review) => ({
                  id: review.id,
                  comment: review.comment,
                  rating: review.rating,
                  username: review.username,
                  createdAt: review.createdAt,
                  updatedAt: review.updatedAt,
              }))
            : [],
    };
};
