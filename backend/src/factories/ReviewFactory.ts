import * as Chance from 'chance';
import { EntityManager } from 'typeorm';
import { Movie } from '../entities/Movie';
import { Review } from '../entities/Review';
import { User } from '../entities/User';

export class ReviewFactory {
    private static chance = new Chance();

    /**
     * Creates a test review
     * @param {Partial<Review>} review
     * @param {EntityManager} manager
     * @param {User} user
     * @param {Movie} movie
     * @param {EntityManager} manager
     * @returns {Promise<Review>}
     */
    public static async createReview(
        review: Partial<Review>,
        user: User,
        movie: Movie,
        manager?: EntityManager,
    ): Promise<Review> {
        let newReview = new Review({
            rating: review.rating ?? this.chance.integer({ min: 1, max: 10 }),
            comment: review.comment ?? this.chance.string(),
            movieTMDBId: movie.tmdbId,
            username: user.username,
            userId: user.id,
        });

        Object.assign(newReview, review);
        if (manager) newReview = await manager.save(Review, newReview);

        return newReview;
    }
}
