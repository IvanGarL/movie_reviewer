import * as Chance from 'chance';
import { EntityManager } from 'typeorm';
import { User, UserRoles } from '../entities/User';
export class UserFactory {
    private static chance = new Chance();

    /**
     * Creates a test user
     * @param {Partial<User>} user
     * @param {EntityManager} manager
     * @returns {Promise<User>}
     */
    public static async createUser(user: Partial<User>, manager?: EntityManager): Promise<User> {
        let newUser = new User({
            email: user.email ?? this.chance.email(),
            username: user.username ?? this.chance.name(),
            password: user.password ?? this.chance.string(),
            role: user.role ?? this.chance.pickone([UserRoles.USER, UserRoles.ADMIN]),
        });

        Object.assign(newUser, user);
        if (manager) newUser = await manager.save(User, newUser);

        return newUser;
    }
}
