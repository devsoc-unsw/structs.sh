import { Router } from 'express';
import healthRouter from './health';
import authRouter from './auth';
import lessonRouter from './lesson';

export const router = Router();

router.use('/', healthRouter, authRouter, lessonRouter);
