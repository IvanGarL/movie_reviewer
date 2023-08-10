import { Chance } from 'chance';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Review } from './Review';

/**
 * Enum of the available roles for a user
 */
export enum UserRoles {
    ADMIN = 'admin',
    USER = 'user',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /**
     * username of the user
     */
    @Column({ length: 50, nullable: true, unique: true })
    username?: string;

    /**
     * email of the user
     */
    @Column({ length: 50, unique: true })
    email: string;

    /**
     * hashed password
     */
    @Column({ length: 100 })
    password: string;

    /**
     * role of the user
     */
    @Column({ type: 'enum', enum: UserRoles })
    role: UserRoles;

    /**
     * Date of creation of the user
     */
    @CreateDateColumn()
    createdAt: Date;

    /**
     * Reviews of the user
     */
    @OneToMany(() => Review, (review) => review.user)
    reviews: Review[];

    constructor(payload?: { username: string; email: string; password: string; role: UserRoles }) {
        if (payload) {
            this.id = new Chance().guid();
            this.email = payload.email;
            this.username = payload.username;
            this.password = payload.password;
            this.role = payload.role;
        }
    }
}
