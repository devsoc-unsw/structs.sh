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
 * Connect to mongoDB client
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

const app = express();

/**
 * CORS
 */
app.use((req, res, next) => {
  /**
   * Website you wish to allow to connect
   */
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.use(cors());
app.options('*', cors());

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

app.use((err, req, res, next) => {
  res.status(err.status || 500).send(err);
});

app.listen(process.env.PORT, () => {
  console.log(` ➤ Structs.sh listening at port: ${process.env.PORT} 🚀`);
});
