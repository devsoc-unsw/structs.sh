import { Router } from 'express';
import { UserMongoService } from '../database-helpers/user';
import consola from 'consola';

const authRouter = Router();
const userService = new UserMongoService();

interface RegisterUserInput {
    username: string;
    password: string;
}

/*
 * Registers a new user
 */
authRouter.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body as RegisterUserInput;
        console.log(`hello: ${username} ${password}`);
        console.log(req.body);
        // Input validation
        if (password.length < 4) {
            res.status(400).json({
                status: 400,
                statusText: 'Password must 4 characters or longer',
            });
        }

        // Creating the user
        console.log('HERE');
        userService.createUser(username, password);

        consola.success(`Successfully registered: ${username}`);
        res.status(200).json({
            status: 200,
            statusText: 'Successfully registered',
            data: { token: 'TODO: GENERATE TOKEN HERE' },
        });
    } catch (err) {
        consola.error(`Failed to register`);
        res.status(401).json({
            status: 401,
            statusText: 'Invalid username or password.',
        });
    }
});

export default authRouter;
