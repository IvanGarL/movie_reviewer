import { Check, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { User } from './User';
import { Movie } from './Movie';

@Entity()
export class Review {
    /**
     * Primary key of the review
     */
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /**
     * Unique id of the movie from TMDB
     */
    @Index()
    @Column()
    movieTmdbId: number;

    /**
     * Unique id of the movie from TMDB
     */
    @Index()
    @Column()
    userId: string;

    /**
     * Unique id of the user
     */
    @Index()
    @Column()
    username: string;

    /**
     * Rating of the movie
     */
    @Column('numeric', { precision: 4, scale: 2, default: 1.0 })
    @Check('rating >= 1.0 AND rating <= 10.0')
    rating: number;

    /**
     * Comment of the review made to the movie
     */
    @Column({ type: 'text' })
    comment: string;

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
    @JoinColumn({ name: 'user_id' })
    user: User;

    /**
     * Movie which the review is made to
     */
    @ManyToOne(() => Movie, (movie) => movie.reviews)
    @JoinColumn({ referencedColumnName: 'tmdbId',  name: 'movie_tmdb_id' })
    movie: Movie;

    constructor(payload?: { rating: number; comment: string; movieTMDBId: number; username: string, userId: string }) {
        if (payload) {
            this.rating = payload.rating;
            this.comment = payload.comment;
            this.movieTmdbId = payload.movieTMDBId;
            this.username = payload.username;
            this.userId = payload.userId;
        }
    }

}