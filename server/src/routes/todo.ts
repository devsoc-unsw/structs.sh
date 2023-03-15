import express, { Request, Response } from 'express'

const router = express.Router()

router.get('/api/todo', (req: Request, res: Response) => {
    return res.send('the todo')
})

router.post('/api/todo', (req: Request, res: Response) => {
    return res.send('new todo created')
})

export { router as todoRouter }