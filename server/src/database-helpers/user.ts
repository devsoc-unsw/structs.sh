import { User } from '../typedefs/user/User';
import { UserModel } from '../schemas/user/user';

/**
 * Database controller for the 'users' collection
 */
export class UserMongoService {
    /**
     * Create a new user
     */
    public async createUser(email: string, password: string): Promise<User> {
        try {
            const createUserResponse = (await UserModel.create({
                email: email,
                password: password,
            })) as User;
            return createUserResponse;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    /**
     * Gets a user by ID
     */
    public async getUserById(id: string): Promise<User> {
        try {
            const userResponse = (await UserModel.findById(id)) as User;
            return userResponse;
        } catch (err) {
            throw new Error(err.message);
        }
    }
}
