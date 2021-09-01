import { Router } from 'express';
import graphqlRouter from './graphql';
import healthRouter from './health';
import userRouter from './user';

export const router = Router();

router.use('/', graphqlRouter, healthRouter, userRouter);
