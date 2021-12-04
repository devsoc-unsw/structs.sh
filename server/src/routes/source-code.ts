import { Router } from 'express';
import { SourceCodeMongoService } from '../database-helpers/source-code';
import { UserModel } from '../schemas/user/user';
import consola from 'consola';
import { TopicModel } from '../schemas/topic/topic';
import { TopicMongoService } from '../database-helpers/topic';

const sourceCodeRouter = Router();
const sourceCodeService = new SourceCodeMongoService();
const topicService = new TopicMongoService();

interface CreateSourceCodeInput {
    topicId: string;
    title: string;
    code: string;
}

/**
 * @swagger
 * /api/source-code:
 *  get:
 *      summary: Fetches all the source code
 *      description: Fetches all the source code belonging to a topic.
 *      tags:
 *          - Source Code
 *      parameters:
 *          - name: topicId
 *            in: query
 *            required: true
 *            description: ID of the topic whose source code is wanted.
 *            schema:
 *                type: string
 *      responses:
 *          '200':
 *              description: All source code fetched successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              statusText:
 *                                  type: string
 *                              sourceCode:
 *                                  type: array
 *                                  items:
 *                                      $ref: '#/components/schemas/SourceCode'
 *          '404':
 *              description: Couldn't find the topic
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              statusText:
 *                                  type: string
 */
sourceCodeRouter.get('/api/source-code', async (req, res) => {
    try {
        const topicId = req.query.topicId as string;
        const snippets = await sourceCodeService.getSourceCodeSnippets(topicId);

        const topic = await TopicModel.findById(topicId);
        if (!topic) {
            return res.status(400).json({
                statusText: `Topic with ID '${topicId}' does not exist`,
            });
        }

        res.status(200).json({
            statusText: 'All the lessons successfully fetched',
            sourceCode: snippets,
        });
    } catch (err) {
        consola.error('Failed to fetch source code. Reason: ', err);
        res.status(500).json({
            statusText: `Fail to fetch source code. Reason: ${err.message}`,
        });
    }
});

/**
 * @swagger
 * /api/source-code:
 *  post:
 *      summary: Create a new source code snippet.
 *      description: Creates a new source code snippet for a given topic.
 *      tags:
 *          - Source Code
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          topicId:
 *                              type: string
 *                          title:
 *                              type: string
 *                          code:
 *                              type: string
 *      responses:
 *          '200':
 *              description: Source code snippet created successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              statusText:
 *                                  type: string
 *                              sourceCode:
 *                                  $ref: '#/components/schemas/SourceCode'
 *          '404':
 *              description: Topic does not exist
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              statusText:
 *                                  type: string
 *          '400':
 *              description: Couldn't create source code snippet because fields were invalid
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              statusText:
 *                                  type: string
 */
sourceCodeRouter.post('/api/source-code', async (req, res) => {
    try {
        const { topicId, title, code } = req.body as CreateSourceCodeInput;

        if (code.length > 10000) {
            return res.status(400).json({
                statusText: 'code cannot be longer than 10000 characters',
            });
        }

        const topic = await TopicModel.findById(topicId);
        if (!topic) {
            return res.status(400).json({
                statusText: `Topic with ID '${topicId}' does not exist`,
            });
        }

        const sourceCode = await sourceCodeService.createSourceCode(
            topicId,
            title,
            code
        );

        await topicService.updateTopicById(
            topicId,
            topic.title,
            topic.description,
            topic.courses,
            topic.image,
            topic.videos,
            [...topic.sourceCodeIds, sourceCode._id] // Attaching source code ID to topic
        );

        consola.success('Source code successfully created');
        res.status(200).json({
            statusText: 'Source code successfully created.',
            sourceCode: sourceCode,
        });
    } catch (err) {
        consola.error('Failed to create source code. Reason: ', err);
        res.status(500).json({
            statusText: `Failed to create source code. Reason: ${err.message}`,
        });
    }
});

/**
 * @swagger
 * /api/source-code/{id}:
 *  put:
 *      summary: Edit an existing source code snippet (TODO!)
 *      description: Edits an existing source code snippet.
 *      tags:
 *          - Source Code
 *      parameters:
 *          - name: id
 *            in: path
 *            required: true
 *            description: ID of the source code to edit
 *            schema:
 *                type: string
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          title:
 *                              type: string
 *                          code:
 *                              type: string
 *      responses:
 *          '200':
 *              description: Source code successfully edited
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              statusText:
 *                                  type: string
 *                              sourceCode:
 *                                  $ref: '#/components/schemas/SourceCode'
 *          '404':
 *              description: No source code snippet with that ID exists
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              statusText:
 *                                  type: string
 *          '400':
 *              description: Invalid edits
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              statusText:
 *                                  type: string
 */
sourceCodeRouter.put('/api/source-code/:id', async (req, res) => {
    throw new Error('Unimplemented');
    // try {
    //     const id = req.params.id;
    //     const { topicId, title, rawMarkdown, creatorId } = req.body;
    //     ...
    // } catch (err) {
    //     consola.error('Failed. Reason: ', err);
    //     res.status(400).json({
    //         statusText: `Failed. Reason: ${err.message}`,
    //     });
    // }
});

/**
 * @swagger
 * /api/source-code/{id}:
 *  delete:
 *      summary: Delete an existing source code snippet (TODO!)
 *      description: Deletes an existing source code snippet
 *      tags:
 *          - Source Code
 *      parameters:
 *          - name: id
 *            in: path
 *            required: true
 *            description: ID of the source code snippet to delete
 *            schema:
 *                type: string
 *      responses:
 *          '200':
 *              description: Source code successfully deleted
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              statusText:
 *                                  type: string
 *                              sourceCode:
 *                                  $ref: '#/components/schemas/SourceCode'
 *          '404':
 *              description: No source code snippet with that ID was found
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              statusText:
 *                                  type: string
 */
sourceCodeRouter.delete('/api/source-code/:id', async (req, res) => {
    throw new Error('Unimplemented');
    // Note: needs to also delete the id from topic.sourceCodeIds so that the topic doesn't have an ID referencing a non-existent snippet

    // try {
    //     const id = req.params.id;
    //     ...
    // } catch (err) {
    //     consola.error('Failed. Reason: ', err);
    //     res.status(400).json({
    //         statusText: `Failed. Reason: ${err.message}`,
    //     });
    // }
});

export default sourceCodeRouter;
