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
 *      responses:
 *          '200':
 *              description: All lessons were successfully fetched
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Lesson'
 *          '500':
 *              description: Structs.sh has failed to retrieve lessons
 *
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              statusText:
 *                                  type: string
 *                                  example: Failed to fetch all lessons
 */
lessonRouter.get('/api/lessons', async (req, res) => {
    try {
        const lessonList = await lessonService.getAllLessons();
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
                status: 200,
                statusText: 'Lesson successfully created.',
                data: lessonData,
            });
        } catch {
            throw new Error('User does not exist');
        }
    } catch (err) {
        consola.error('Fail to create the content.');
        res.status(400).json({
            status: 400,
            statusText: `Fail to create the content. ${err}`,
        });
    }
});

lessonRouter.get('/api/lessons/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const lessonData = await lessonService.getLessonById(id);
        res.status(200).json({
            status: 200,
            statusText: 'Lesson successfully fetched',
            data: lessonData,
        });
    } catch (err) {
        consola.error('Fail to fetch the lesson.');
        res.status(400).json({
            status: 400,
            statusText: `Fail to fetch the lesson. ${err}`,
        });
    }
});

lessonRouter.get('/api/lessons/myLessons/:creatorId', async (req, res) => {
    try {
        const { creatorId } = req.params;

        await UserModel.findById(creatorId);

        const lessons = await lessonService.getLessonByUserId(creatorId);
        res.status(200).json({
            status: 200,
            statusText: 'Lessons created by the user successfully fetched',
            data: lessons,
        });
    } catch (err) {
        consola.error('Fail to fetch the lesson.');

        res.status(400).json({
            status: 400,
            statusText: `Fail to fetch the lessons. The user does not exist.`,
        });
    }
});

export default lessonRouter;
