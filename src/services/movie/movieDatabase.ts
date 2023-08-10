import { EntityManager, SelectQueryBuilder } from 'typeorm';
import { Review } from '../../entities/Review';

/**
 * Create a query to get all the reviews of a movie
 * @param {EntityManager} manager
 * @param {number} tmdbId
 * @returns {SelectQueryBuilder<Review>}
 */
export const createMovieReviewsQuery = (manager: EntityManager, tmdbId: number): SelectQueryBuilder<Review> => {
    return manager.createQueryBuilder(Review, 'review').where('review.movie_tmdb_id = :tmdbId', { tmdbId });
};
