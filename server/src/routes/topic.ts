import { Router } from 'express';
import consola from 'consola';
import { TopicMongoService } from 'src/database-helpers/topic';
import { Topic } from 'src/typedefs/topic/Topic';

const topicRouter = Router();
const topicService = new TopicMongoService();

/**
 * @swagger
 * /api/topics:
 *  get:
 *      summary: Fetches topics
 *      description: Fetches all topics.
 *      tags:
 *          - Topics
 *      responses:
 *          '200':
 *              description: Succesfully fetched all topics
 *              content:
 *                  application/json:
 *                     schema:
 *                         type: object
 *                         properties:
 *                             statusText:
 *                                 type: string
 *                             topics:
 *                                 type: array
 *                                 items:
 *                                     $ref: '#/components/schemas/Topic'
 *          '500':
 *              description: Structs.sh failed to fetch all topics
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              statusText:
 *                                  type: string
 */
topicRouter.get('/api/topics', async (_, response) => {
    try {
        const topics: Topic[] = await topicService.getAllTopics();
        return response.status(200).json({
            statusText: `Successfully fetched all topics`,
            topics: topics,
        });
    } catch (err) {
        // Failure to get quiz questions
        consola.error(`Failed to fetch topics. Reason: `, err);
        response.status(500).json({
            statusText: `Failed to fetch topics. Reason: ${err.message}`,
        });
    }
});

/**
 * @swagger
 * /api/topics:
 *  post:
 *      summary: Creates a topic (TODO!)
 *      description: Creates a new topic
 *      tags:
 *          - Topics
 *      responses:
 *          '200':
 *              description: successfully created new topic
 *              content:
 *                  application/json:
 *                     schema:
 *                         type: object
 *                         properties:
 *                             statustext:
 *                                 type: string
 *          '400':
 *              description: Invalid arguments
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              statusText:
 *                                  type: string
 */
topicRouter.post('/api/topics', async (_, response) => {
    throw new Error('Unimplemented');
});

/**
 * @swagger
 * /api/topics:
 *  put:
 *      summary: Edits a topic (TODO!)
 *      description: Edits an existing topic
 *      tags:
 *          - Topics
 *      responses:
 *          '200':
 *              description: successfully created new topic
 *              content:
 *                  application/json:
 *                     schema:
 *                         type: object
 *                         properties:
 *                             statustext:
 *                                 type: string
 *          '400':
 *              description: Invalid arguments
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              statusText:
 *                                  type: string
 */
topicRouter.put('/api/topics', async (_, response) => {
    throw new Error('Unimplemented');
});

/**
 * @swagger
 * /api/topics:
 *  delete:
 *      summary: Deletes a topic (TODO!)
 *      description: Deletes a topic
 *      tags:
 *          - Topics
 *      responses:
 *          '200':
 *              description: Successfully deleted topic
 *              content:
 *                  application/json:
 *                     schema:
 *                         type: object
 *                         properties:
 *                             statustext:
 *                                 type: string
 *          '404':
 *              description: Couldn't find topic with that ID
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              statusText:
 *                                  type: string
 */
topicRouter.delete('/api/topics', async (_, response) => {
    throw new Error('Unimplemented');
});

export default topicRouter;
