import { Check, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { User } from './User';
import { Movie } from './Movie';

@Unique('movie_review_by_user', ['movieTmdbId', 'username'])
@Entity()
export class Review {
    /**
     * Primary key of the review
     */
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /**
     * Rating of the movie
     */
    @Column('numeric', { precision: 2, scale: 1, default: 0 })
    @Check('rating >= 1 AND rating <= 10')
    rating: number;

    /**
     * Comment of the review made to the movie
     */
    @Column({ type: 'text' })
    comment: string;

    /**
     * Unique id of the movie from TMDB
     */
    @Index()
    @Column()
    movieTmdbId: number;

    /**
     * Unique id of the user
     */
    @Index()
    @Column()
    username: string;

    /**
     * Date of creation of the review in the database
     */
    @CreateDateColumn()
    createdAt: Date;

    /**
     * Date of update of the review in the database
     */
    @UpdateDateColumn()
    updatedAt: Date;

    /**
     * User who made the review
     */
    @ManyToOne(() => User, (user) => user.reviews)
    @JoinColumn({ name: 'userId' })
    user: User;

    /**
     * Movie which the review is made to
     */
    @ManyToOne(() => Movie, (movie) => movie.reviews)
    @JoinColumn({ name: 'movieTMDBId' })
    movie: Movie;

    constructor(payload?: { rating: number; comment: string; movieTMDBId: number; username: string }) {
        if (payload) {
            this.rating = payload.rating;
            this.comment = payload.comment;
            this.movieTmdbId = payload.movieTMDBId;
            this.username = payload.username;
        }
    }

}