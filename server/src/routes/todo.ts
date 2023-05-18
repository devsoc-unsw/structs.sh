import express, { Request, Response } from 'express'
import { Todo } from '../models/todo'
import { dataStructure } from '../models/dataStructure'

const router = express.Router()

router.get('/api/todo', [], async (req: Request, res: Response) => {
    const todo = await dataStructure.find({})
    return res.status(200).send(todo)
})

router.post('/api/todo', async (req: Request, res: Response) => {
    console.log(req.body);
    const { owner, type, data } = req.body;

    const ds = dataStructure.build({ owner, type, data });
    await ds.save()
    return res.status(201).send(ds);
})

router.delete('/api/delete', async (req: Request, res: Response) => {
    console.log("hello");
    const { title } = req.body;

    await Todo.findOneAndDelete({ title: title })
        .then((deletedDoc) => {
            if (deletedDoc) {
                // Document was found and deleted successfully
                console.log("Document deleted:", deletedDoc);
            } else {
                // Document with the specified title was not found
                console.log("Document not found");
            }
        })
        .catch((error) => {
            // Handle error if deletion fails
            console.error("Error deleting document:", error);
        });
    return res.status(201).send();
})

export { router as todoRouter }