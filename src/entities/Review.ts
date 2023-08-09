import { Check, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';
import { Movie } from './Movie';

@Entity()
export class Review {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('numeric', { precision: 2, scale: 1, default: 0 })
    @Check('rating >= 0 AND rating <= 10')
    rating: number;

    @Column({ type: 'text' })
    comment: string;

    @Index()
    @Column()
    movieTmdbId: string;

    @Index()
    @Column()
    userId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.reviews)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Movie, (movie) => movie.reviews)
    @JoinColumn({ name: 'movieTMDBId' })
    movie: Movie;

    constructor(payload?: { rating: number; comment: string; movieTMDBId: string; userId: string }) {
        if (payload) {
            this.rating = payload.rating;
            this.comment = payload.comment;
            this.movieTmdbId = payload.movieTMDBId;
            this.userId = payload.userId;
        }
    }

}