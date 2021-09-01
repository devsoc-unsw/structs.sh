import express, { Router } from 'express';
import jwt from 'express-jwt';
import { router } from './routes';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

/**
 * Configure process environment to the .env file
 */
dotenv.config();

/**
 * Connect to mongoDB client for GalacticEd
 */
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on(
  'error',
  console.error.bind(
    console,
    'An error occurred while connecting to MongoDB 😭: '
  )
);

/**
 * Initialise the app
 */
const app = express();

/**
 * Add allowlist for the frontend
 */
app.use((req, res, next) => {
  /**
   * Website you wish to allow to connect
   */
  res.setHeader(
    'Access-Control-Allow-Origin',
    'http://localhost:3000; https://platform-azure.vercel.app/'
  );
  next();
});

app.use(cors());
app.options('*', cors());

/**
 * Setup JWT authentication for protected routes
 */
app.use(
  '/',
  jwt({ secret: 'test', algorithms: ['HS256'] }).unless({
    path: ['/health-check', '/login', '/graphiql', '/graphql'],
  })
);

/**
 * Add body parsing and urlencoded from deprecated bodyParser
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Add all routes to the app
 */
const appRoutes = router;
app.use(appRoutes);

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).send(err);
});

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`GalacticEd Backend running on port ${process.env.PORT} 🚀`);
});
