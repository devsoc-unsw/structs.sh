import { Router } from 'express';
import { LessonMongoService } from '../database-helpers/lesson';
import { UserModel } from '../schemas/user/user';
import consola from 'consola';

const lessonRouter = Router();
const lessonService = new LessonMongoService();

interface CreateLessonInput {
    rawMarkdown: string;
    creatorId: string;
}

/**
 * @swagger
 * /api/lessons:
 *  get:
 *      summary: Fetches all lessons
 *      description: Fetches all the lessons.
 *      tags:
 *          - Lessons
 *      parameters:
 *          - name: creatorId
 *            in: query
 *            required: false
 *            description: ID of the user's whose lessons we want to fetch (the ones that they are the creator of). Leave this empty to fetch lessons from all users
 *            schema:
 *                type: string
 *          - name: topicId
 *            in: query
 *            required: false
 *            description: ID of the topic to filter by. Leave this empty to fetch lessons of all topics
 *            schema:
 *                type: string
 *      responses:
 *          '200':
 *              description: All lessons were successfully fetched
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Lesson'
 *          '500':
 *              description: Structs.sh has failed to retrieve lessons
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              statusText:
 *                                  type: string
 */
lessonRouter.get('/api/lessons', async (req, res) => {
    try {
        // Fetching every lessons
        let lessonList = await lessonService.getAllLessons();

        // Applying filters on topic type and creator. Note: it would be more optimal to apply the filtering at the database level than here
        const creatorId = req.query.creatorId as string;
        const topicId = req.query.topicId as string;

        if (creatorId) {
            lessonList = lessonList.filter(
                (lesson) => lesson.creatorId === creatorId
            );
        }
        if (topicId) {
            lessonList = lessonList.filter(
                (lesson) => lesson.topicId === topicId
            );
        }

        res.status(200).json({
            statusText: 'All the lessons successfully fetched',
            data: lessonList,
        });
    } catch (err) {
        consola.error('Failed to fetch all the lessons. Reason: ', err);
        res.status(500).json({
            statusText: `Fail to fetch all the lessons. Reason: ${err.message}`,
        });
    }
});

/**
 * @swagger
 * /api/lessons:
 *  post:
 *      summary: Create a new lesson
 *      description: Creates a new lesson under a topic.
 *      tags:
 *          - Lessons
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          topic:
 *                              type: string
 *                          rawMarkdown:
 *                              type: string
 *                          creatorId:
 *                              type: string
 *      responses:
 *          '200':
 *              description: Lesson created successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              statusText:
 *                                  type: string
 *                              lesson:
 *                                  $ref: '#/components/schemas/Lesson'
 *          '400':
 *              description: Couldn't create lesson because fields were invalid or missing
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              statusText:
 *                                  type: string
 */
lessonRouter.post('/api/lessons', async (req, res) => {
    try {
        const { rawMarkdown, creatorId } = req.body as CreateLessonInput;

        if (rawMarkdown.length > 10000) {
            throw new Error('Markdown cannot be longer than 10000 characters.');
        }

        try {
            await UserModel.findById(creatorId);

            const lessonData = await lessonService.createLesson(
                rawMarkdown,
                creatorId
            );
            consola.success('Lesson successfully created');
            res.status(200).json({
                statusText: 'Lesson successfully created.',
                lesson: lessonData,
            });
        } catch {
            res.status(400).json({
                statusText: `User with ID '${creatorId}' does not exist`,
            });
        }
    } catch (err) {
        consola.error('Failed to create the content. Reason: ', err);
        res.status(500).json({
            statusText: `Failed to create the content. ${err.message}`,
        });
    }
});

/**
 * @swagger
 * /api/lessons/{id}:
 *  get:
 *      summary: Fetches a lesson
 *      description: Fetches a lesson with the specific `ID`.
 *      tags:
 *          - Lessons
 *      parameters:
 *          - name: id
 *            in: path
 *            required: true
 *            description: ID of the lesson to fetch
 *            schema:
 *                type: string
 *      responses:
 *          '200':
 *              description: Lesson found
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              statusText:
 *                                  type: string
 *                              lesson:
 *                                  $ref: '#/components/schemas/Lesson'
 *          '404':
 *              description: No lesson with the given ID exists.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              statusText:
 *                                  type: string
 */
lessonRouter.get('/api/lessons/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const lessonData = await lessonService.getLessonById(id);
        if (!lessonData) {
            res.status(404).json({
                statusText: `No lesson with the ID '${id}' exists`,
            });
        } else {
            res.status(200).json({
                statusText: 'Lesson successfully fetched',
                lesson: lessonData,
            });
        }
    } catch (err) {
        consola.error('Failed to fetch the lesson. Reason: ', err);
        res.status(400).json({
            statusText: `Fail to fetch the lesson. Reason: ${err.message}`,
        });
    }
});

/**
 * @swagger
 * /api/lessons/{id}:
 *  put:
 *      summary: Edit an existing lesson (TODO!)
 *      description: Edits the contents and metadata for an existing lesson.
 *      tags:
 *          - Lessons
 *      parameters:
 *          - name: id
 *            in: path
 *            required: true
 *            description: ID of the lesson to edit
 *            schema:
 *                type: string
 *      responses:
 *          '200':
 *              description: Lesson successfully edited
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              statusText:
 *                                  type: string
 *          '404':
 *              description: No lesson with the given ID exists.
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
lessonRouter.get('/api/lessons/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const lessonData = await lessonService.getLessonById(id);
        if (!lessonData) {
            res.status(404).json({
                statusText: `No lesson with the ID '${id}' exists`,
            });
        } else {
            res.status(200).json({
                statusText: 'Lesson successfully fetched',
                lesson: lessonData,
            });
        }
    } catch (err) {
        consola.error('Failed to fetch the lesson. Reason: ', err);
        res.status(400).json({
            statusText: `Fail to fetch the lesson. Reason: ${err.message}`,
        });
    }
});

export default lessonRouter;
