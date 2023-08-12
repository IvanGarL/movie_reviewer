import { EntityManager, SelectQueryBuilder } from 'typeorm';
import { Review } from '../../entities/Review';

/**
 * Create a query to get all the reviews of a user
 * @param {EntityManager} manager
 * @param {string} username
 * @returns {SelectQueryBuilder<Review>}
 */
export const createUserReviewsQuery = (manager: EntityManager, username: string): SelectQueryBuilder<Review> => {
    return manager.createQueryBuilder(Review, 'review')
        .innerJoinAndSelect('review.movie', 'movie')
        .where('review.username = :username', { username });
};
