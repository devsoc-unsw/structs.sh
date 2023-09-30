import express from 'express';
import mongoose from 'mongoose';
import { json } from 'body-parser';
import { router } from './routes/routes';
import cors from 'cors';

const port = 8001;

const app = express();

app.use(cors());
app.use(json());
app.use(router);

const connectionString =
    'mongodb+srv://jinsunwoo:b6M4MmX5x6gt3y7l@structsdb.1rge7z4.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(connectionString).then(() => {
    console.log('Connected to MongoDB 🍃');
    app.listen(port, () => {
        console.log(`Collab Server listening on port ${port} 🚀`);
    });
});
