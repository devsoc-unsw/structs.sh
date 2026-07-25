import express, { type Request, type Response } from 'express';
import { dataStructure } from '../models/dataStructure';

const router = express.Router();

router.get('/api/getAll', [], async (req: Request, res: Response) => {
  const dataStructureDocuments = await dataStructure.find({});
  return res.status(200).send(dataStructureDocuments);
});