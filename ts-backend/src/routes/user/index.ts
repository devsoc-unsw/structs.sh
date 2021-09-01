import { Router } from 'express';
import { generateToken } from '../../utils';
import bcrypt from 'bcrypt';
import { UserMongoService } from '../../dbHandlers/user';

const loginRouter = Router();

const userService = new UserMongoService();

/**
 * Unprotected user login route, to get a JWT token if the username pass is correct
 */
loginRouter.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    var userFromUsername = null;
    userFromUsername = await userService.getUserByUsername(username);
    if (!userFromUsername) {
      userFromUsername = await userService.getUserByEmail(username);
    }
    if (!userFromUsername) {
      res.status(401).json({
        status: 401,
        statusText: 'Invalid username or email.',
      });
    }
    const storedHash = userFromUsername.password;
    bcrypt.compare(password, storedHash, (err, result) => {
      if (result || password === storedHash) {
        res.status(200).json({
          status: 200,
          statusText: 'Successfully logged in!',
          data: { token: generateToken(userFromUsername) },
        });
      } else {
        res.status(401).json({
          status: 401,
          statusText: 'Invalid username or password.',
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({
      status: 401,
      statusText: 'Invalid username or password.',
    });
  }
});

export default loginRouter;
