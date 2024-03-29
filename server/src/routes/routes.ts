import express, { type Request, type Response } from 'express';
import { dataStructure } from '../models/dataStructure';
import { users } from '../models/users';
import { authLogin, authRegister } from '../service/service';
import { writeFileSync, readFileSync, existsSync, mkdirSync, readdirSync } from 'fs';

const router = express.Router();

router.get('/api/getAll', [], async (req: Request, res: Response) => {
  const dataStructureDocuments = await dataStructure.find({});
  return res.status(200).send(dataStructureDocuments);
});

router.get('/api/getOwnedData', [], async (req: Request, res: Response) => {
  const topicTitle = req.query['topicTitle'];
  const user = req.query['user'];
  const dataStructureDocuments = await dataStructure.find({ owner: user, type: topicTitle });
  console.log(dataStructureDocuments);
  return res.status(200).send(dataStructureDocuments);
});

router.post('/api/save', async (req: Request, res: Response) => {
  console.log(req.body);
  const { owner, type, name, data } = req.body;

  const ds = dataStructure.build({ owner, type, name, data });
  await ds.save();
  return res.status(201).send(ds);
});

router.delete('/api/delete', async (req: Request, res: Response) => {
  const { owner, type } = req.body;
  console.log('deleting');
  console.log(req.body);
  await dataStructure
    .findOneAndDelete({ owner, type })
    .then((deletedDoc) => {
      if (deletedDoc) {
        // Document was found and deleted successfully
        console.log('Document deleted:', deletedDoc);
      } else {
        // Document with the specified title was not found
        console.log('Document not found');
      }
    })
    .catch((error) => {
      // Handle error if deletion fails
      console.error('Error deleting document:', error);
    });
  return res.status(201).send();
});

router.delete('/api/deleteAll', async (req: Request, res: Response) => {
  // const { owner } = req.body;
  console.log('deleting everything');
  console.log(req.body);
  const result = await dataStructure.deleteMany({});

  console.log('Deleted ' + result.deletedCount + ' documents');
  return res.status(201).send();
});

router.delete('/api/deleteAllUsers', async (req: Request, res: Response) => {
  console.log('deleting all users');
  console.log(req.body);
  await users.deleteMany({});

  return res.status(201).send();
});

router.get('/api/getAllUsers', [], async (req: Request, res: Response) => {
  const dataStructureDocuments = await users.find({});
  return res.status(200).send(dataStructureDocuments);
});

router.post('/auth/register', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const registered = await authRegister(username, password);
  res.json({ registered });
});

router.post('/auth/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const found = await authLogin(username, password);
  res.json({ found });
});


router.post('/api/saveFile', (req : Request, res: Response) => {
  const { username, workspace, filename, fileData } = req.body;
  const path = './user-files/' + username + '/workspaces/' + workspace + '/' + filename;

  try {
    writeFileSync(path, fileData);
    // save to volume here
    res.json({ path: path });
  } catch (err) {
    res.json({ error: err });
  }
});

router.post('/api/updateFile', (req : Request, res: Response) => {
  const { username, workspace, filename, fileData } = req.body;
  const path = './user-files/' + username + '/workspaces/' + workspace + '/' + filename;
  if (!existsSync(path)) {
    res.json({ error: 'Invaild path' });
    return;
  }

  try {
    writeFileSync(path, fileData);
    // save to volume here
    res.json({ path: path });
  } catch (err) {
    res.json({ error: err });
  }
});

router.post('/api/saveWorkspace', (req: Request, res: Response) => {
  const { username, workspaceName } = req.body;

  let path = './user-files/' + username + '/workspaces';
  try {
    if (!existsSync(path)) {
      mkdirSync(path);
    }

    path = path + '/' + workspaceName;
    if (!existsSync(path)) {
      mkdirSync(path);
    }

    res.json({ path: path });
  } catch (err) {
    res.json({ error: err });
  }
});

router.get('/api/retrieveFilesInWorkspace', (req: Request, res: Response) => {
  const username = req.query.username;
  const workspaceName = req.query.workspaceName;
  const dirPath = './user-files/' + username + '/workspaces/' + workspaceName;

  const files = [];
  try {
    const dirFiles = readdirSync(dirPath);
    for (const file of dirFiles) {
      const filename = file;
      const filePath = dirPath + '/' + filename;
      const content = readFileSync(filePath).toString();
      files.push({name: filename, text: content});
    }

    res.send({ files: files });
  } catch (err) {
    res.send({ error: err });
  }
});

router.get('/api/retrieveFile', (req: Request, res: Response) => {
  const username = req.query.username;
  const workspace = req.query.workspace;
  const filename = req.query.filename;
  const path = './user-files/' + username + '/workspaces/' + workspace + '/' + filename;

  try {
    const file = readFileSync(path).toString();
    res.send({ content: file });
  } catch (err) {
    res.send({ error: err });
  }
});

router.get('/api/retrieveWorkspaces', (req: Request, res: Response) => {
  const username = req.query.username;
  const path = './user-files/' + username + '/workspaces/';

  try {
    const workspaces = readdirSync(path);
    res.send({ workspaces: workspaces });
  } catch (err) {
    res.send({ error: err });
  }
});

export { router };
