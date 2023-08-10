import { Column, CreateDateColumn, Entity, In, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Review } from './Review';

@Entity()
export class Movie {
    /**
     * Unique id of the movie
     */
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /**
     * Unique id of the movie from TMDB
     */
    @Index()
    @Column({ unique: true })
    tmdbId: number;

    /**
     * Title of the movie
     */
    @Column({ length: 150 })
    title: string;

    /**
     * Overview of the movie
     */
    @Column({ type: 'text' })
    overview: string;

    /**
     * Poster path of the movie
     */
    @Column({ length: 100, nullable: true })
    posterPath: string;

    /**
     * Release date of the movie
     */
    @Column({ nullable: true })
    releaseDate: Date;

    /**
     * Date of creation of the movie in the database
     */
    @CreateDateColumn()
    createdAt: Date;

    /**
     * Reviews of the movie
     */
    @OneToMany(() => Review, (review) => review.movie)
    reviews: Review[];

    constructor(payload?: { tmdbId: number; title: string; overview: string; posterPath?: string; releaseDate?: Date }) {
        if (payload) {
            this.tmdbId = payload.tmdbId;
            this.title = payload.title;
            this.overview = payload.overview;
            this.posterPath = payload.posterPath;
            this.releaseDate = payload.releaseDate;
        }
    }
}