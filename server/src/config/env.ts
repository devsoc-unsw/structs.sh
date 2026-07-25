import { z } from 'zod';

const optionalPositiveInteger = z.preprocess(
    (value) => (value === '' ? undefined : value), 
    z.coerce.number().int().positive().optional()
);

// const postgresUrlSchema = z.string().min(1).superRefine()