import express, { Router } from 'express';
import jwt from 'express-jwt';
import { router } from './routes';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerJsDoc, { Options } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

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
 * Allow CORS requests
 */
app.use((req, res, next) => {
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

/**
 * Swagger documentation generator.
 *   See: https://www.npmjs.com/package/swagger-ui-express
 *        https://www.npmjs.com/package/swagger-jsdoc
 * The OpenAPI Specification defines a standard interface to REST APIs.
 */

const swaggerOptions: Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Structs.sh API',
            version: '1.0.0',
            description:
                'This is a set of auto-generated documentation for the Structs.sh API. This contains endpoints for managing users and learning resources on Structs.sh.',
            license: {
                name: 'MIT',
                url: 'https://spdx.org/licenses/MIT.html',
            },
        },
    },
    // Tells Swagger which endpoints to source documentation from
    apis: [`${__dirname}/routes/*.ts`, `${__dirname}/schemas/*.ts`],
};

const opt = {
    // Customising the theme of the Swagger documentation pages
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Structs API Docs',
};

const specs = swaggerJsDoc(swaggerOptions);

// Serve the documentation on the root URL
app.use('/', swaggerUi.serve, swaggerUi.setup(specs, opt));

/**
 * Starting the server
 */
app.listen(process.env.PORT, () => {
    console.log(` ➤ Structs.sh listening at port: ${process.env.PORT} 🚀`);
});
