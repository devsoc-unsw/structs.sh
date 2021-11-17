import { Router } from 'express';
import { UserMongoService } from '../database-helpers/user';
import consola from 'consola';

const authRouter = Router();
const userService = new UserMongoService();

interface RegisterUserInput {
    username: string;
    password: string;
}

/**
 * @swagger
 * /register:
 *  post:
 *      summary: Registers a new user (TODO!)
 *      description: Registers a new user into the system with the given username, email and password.
 *      tags:
 *          - Authentication
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                              exmaple: John Shepherd
 *                          email:
 *                              type: string
 *                              exmaple: john.shepherd@gmail.com
 *                          password:
 *                              type: string
 *                              exmaple: iloveandrew
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

/**
 * TODO: Login endpoint here
 *
 * @swagger
 * /login:
 *  post:
 *      summary: Log in an existing user (TODO!)
 *      description: Logs in an existing user in the system with the given email/username and password.
 *      tags:
 *          - Authentication
 *      requestBody:
 *          required: true
 */
authRouter.post('/login', async (req, res) => {
    throw new Error('Unimplemented');
});

export default authRouter;
