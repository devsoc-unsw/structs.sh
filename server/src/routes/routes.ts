import express, { Request, Response } from 'express'
import { dataStructure } from '../models/dataStructure'
import { users } from '../models/users'
import { authLogin, authRegister } from '../service'

const router = express.Router()

router.get('/api/getAll', [], async (req: Request, res: Response) => {
    const dataStructureDocuments = await dataStructure.find({})
    return res.status(200).send(dataStructureDocuments)
})

router.post('/api/save', async (req: Request, res: Response) => {
    console.log(req.body);
    const { owner, type, data } = req.body;

    const ds = dataStructure.build({ owner, type, data });
    await ds.save()
    return res.status(201).send(ds);
})

router.delete('/api/delete', async (req: Request, res: Response) => {
    const { owner, type } = req.body;
    console.log("deleting");
    console.log(req.body);
    await dataStructure.findOneAndDelete({ owner: owner, type: type })
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

router.delete('/api/deleteAll', async (req: Request, res: Response) => {
    const { owner, type } = req.body;
    console.log("deleting everything");
    console.log(req.body);
    const result = await dataStructure.deleteMany({ owner: owner })

    console.log("Deleted " + result.deletedCount + " documents");
    return res.status(201).send();
})

router.delete('/api/deleteAllUsers', async (req: Request, res: Response) => {
    const { owner, type } = req.body;
    console.log("deleting all users");
    console.log(req.body);
    const result = await users.deleteMany({})

    return res.status(201).send();
})

router.get('/api/getAllUsers', [], async (req: Request, res: Response) => {
    const dataStructureDocuments = await users.find({})
    return res.status(200).send(dataStructureDocuments)
})

router.post('/auth/register', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const registered = await authRegister(username, password);
    res.json({ registered });
})

router.post('/auth/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const found = await authLogin(username, password);
    res.json({ found });
})

export { router }