import { Router } from 'express';
import { LessonMongoService } from '../database-helpers/lesson';
import { UserModel } from '../schemas/user/user';
import consola from 'consola';
import { TopicModel } from '../schemas/topic/topic';
import { Lesson } from 'src/typedefs/lesson/Lesson';

const lessonRouter = Router();
const lessonService = new LessonMongoService();

interface CreateLessonInput {
    topicId: string;
    title: string;
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
 *                          type: object
 *                          properties:
 *                              statusText:
 *                                  type: string
 *                              lessons:
 *                                  type: array
 *                                  items:
 *                                      $ref: '#/components/schemas/Lesson'
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
            lessons: lessonList,
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
 *                          topicId:
 *                              type: string
 *                          title:
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
        const { topicId, title, rawMarkdown, creatorId } =
            req.body as CreateLessonInput;

        if (rawMarkdown.length > 10000) {
            return res.status(400).json({
                statusText: 'Markdown cannot be longer than 10000 characters',
            });
        }

        const user = await UserModel.findById(creatorId);
        if (!user) {
            return res.status(400).json({
                statusText: `User with ID '${creatorId}' does not exist`,
            });
        }

        const topic = await TopicModel.findById(topicId);
        if (!topic) {
            return res.status(404).json({
                statusText: `Topic with ID '${topicId}' does not exist`,
            });
        }
        consola.info('HERE');

        const lessonData = await lessonService.createLesson(
            topicId,
            title,
            rawMarkdown,
            creatorId
        );

        consola.success('Lesson successfully created');
        res.status(200).json({
            statusText: 'Lesson successfully created.',
            lesson: lessonData,
        });
    } catch (err) {
        consola.error('Failed to create lesson. Reason: ', err);
        res.status(500).json({
            statusText: `Failed to create lesson. Reason: ${err.message}`,
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
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          title:
 *                              type: string
 *                          rawMarkdown:
 *                              type: string
 *                          quizzes:
 *                              type: string
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
lessonRouter.put('/api/lessons/:id', async (req, res) => {
    try {
        const id = req.params.id as string;
        const { title, rawMarkdown, quizzes } = req.body;

        const lesson: Lesson = await lessonService.getLessonById(id);
        if (!lesson) {
            return res.status(404).json({
                statusText: `Lesson with ID '${id}' doesn't exist`,
            });
        }

        const editedLesson: Lesson = await lessonService.updateLessonById(
            id,
            title,
            rawMarkdown,
            quizzes
        );

        consola.success('Successsfully edited lesson');
        return res.status(200).json({
            statusText: 'Successfully edited topic',
            lesson: editedLesson,
        });
    } catch (err) {
        consola.error('Failed. Reason: ', err);
        res.status(400).json({
            statusText: `Failed. Reason: ${err.message}`,
        });
    }
});

/**
 * @swagger
 * /api/lessons/{id}:
 *  delete:
 *      summary: Delete an existing lesson (TODO!)
 *      description: Deletes an existing lesson and all its associated quizzes.
 *      tags:
 *          - Lessons
 *      parameters:
 *          - name: id
 *            in: path
 *            required: true
 *            description: ID of the lesson to delete
 *            schema:
 *                type: string
 *      responses:
 *          '200':
 *              description: Lesson successfully deleted
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
lessonRouter.delete('/api/lessons/:id', async (req, res) => {
    throw new Error('Unimplemented');
    // Note: needs to go through each quiz ID in lesson.quizzes and call a method like QuizService.deleteById(quizId) on each quizId

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

export default lessonRouter;
