import { Router } from 'express';
import { QuizMongoService } from '../database-helpers/quiz';
import { LessonMongoService } from '../database-helpers/lesson';
import consola from 'consola';
import { Lesson } from 'src/typedefs/lesson/Lesson';
import { Quiz } from 'src/typedefs/quiz/Quiz';

const quizRouter = Router();
const quizzesService = new QuizMongoService();
const lessonService = new LessonMongoService();

interface CreateQuizInput {
    lessonId: string;
    questionType: string;
    question: string;
    answer: string;
}

/**
 * @swagger
 * /api/lessons/quiz:
 *  get:
 *      summary: Fetches a lesson's quizzes
 *      tags:
 *          - Quiz
 *      description: Fetches the quizzes of a lesson with the given ID
 *      parameters:
 *          - name: lessonId
 *            in: query
 *            description: ID of the lesson whose quizzes are to be fetched
 *            required: true
 *            schema:
 *                type: string
 *      responses:
 *          '200':
 *              description: Succesfully fetched lesson's quizzes
 *              content:
 *                  application/json:
 *                     schema:
 *                         type: object
 *                         properties:
 *                             statusText:
 *                                 type: string
 *                             quizzes:
 *                                 type: array
 *                                 items:
 *                                     $ref: '#/components/schemas/Quiz'
 *          '404':
 *              description: Lesson with that ID doesn't exist
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              statusText:
 *                                  type: string
 */
quizRouter.get('/api/lessons/quiz', async (request, response) => {
    try {
        const lessonId = request.query.lessonId as string;
        consola.info(`Getting quiz questions for lesson: ${lessonId}`);

        const lesson: Lesson = await lessonService.getLessonById(lessonId);
        if (!lesson) {
            consola.error(`Lesson with ID '${lessonId}' does not exist`);
            return response.status(404).json({
                statusText: `Lesson with ID '${lessonId}' does not exist`,
            });
        }

        console.log(lesson);

        // Fetching quizzes
        const quizFetchQueries: Promise<Quiz>[] = lesson.quizzes.map((quizId) =>
            quizzesService.getQuizById(quizId)
        );
        const quizzes: Quiz[] = await Promise.all(quizFetchQueries);

        consola.success(`Successfully fetched quizzes for lesson: ${lessonId}`);
        response.status(200).json({
            statusText: `Successfully fetched quizzes for lesson: ${lessonId}`,
            quizzes: quizzes,
        });
    } catch (err) {
        // Failure to get quiz questions
        consola.error(`Failed to get quiz. Reason: `, err);
        response.status(500).json({
            statusText: `Failed to get quiz. Reason: ${err.message}`,
        });
    }
});

/**
 * @swagger
 * /api/lessons/quiz:
 *  post:
 *      summary: Creates a new quiz for a lesson
 *      description: "Creates a new quiz and attaches it to a lesson's existing set of quizzes. Note: valid `questionType` values currently include `mc` for multiple choice, `qa` for question-answer"
 *      tags:
 *          - Quiz
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          lessonId:
 *                              type: string
 *                          questionType:
 *                              type: string
 *                          question:
 *                              type: string
 *                          answer:
 *                              type: string
 *      responses:
 *          '200':
 *               description: Succesfully fetched lesson's quizzes
 *               content:
 *                   application/json:
 *                       schema:
 *                           type: object
 *                           properties:
 *                               statusText:
 *                                   type: string
 *                               quiz:
 *                                   $ref: '#/components/schemas/Quiz'
 *
 *          '404':
 *              description: Lesson with that ID doesn't exist
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              statusText:
 *                                  type: string
 */
quizRouter.post('/api/lessons/quiz', async (request, response) => {
    try {
        const { lessonId, questionType, question, answer } =
            request.body as CreateQuizInput;
        consola.info(
            `Creating a quiz for a lesson.\n\tQuestion:\t'${question}'\n\Type:\t'${questionType}'\n\tAnswer:\t'${answer}'`
        );

        // Retrieve lesson/check lesson exists
        try {
            await lessonService.getLessonById(lessonId);
        } catch {
            consola.error(`Lesson with ID '${lessonId}' does not exist`);
            return response.status(404).json({
                statusText: `Lesson with ID '${lessonId}' does not exist`,
            });
        }

        // Check if valid questionType
        if (!['mc', 'qa'].includes(questionType)) {
            consola.error(
                `Failed to create quiz. Invalid question type: ${questionType}`
            );
            return response.status(400).json({
                statusText: `Invalid question type '${questionType}'`,
            });
        }

        // Create a quiz question in database
        const createdQuiz = await quizzesService.createQuiz(
            questionType,
            question,
            answer
        );
        consola.success(`Created quiz with ID: ${createdQuiz._id}`);

        // Add quiz question to database based on id
        //......................................................................................................
        const lesson = await lessonService.getLessonById(lessonId);
        let quizzes = lesson.quizzes;
        quizzes.push(createdQuiz._id);

        await lessonService.updateLessonById(lessonId, quizzes);

        consola.success(`Successfully created quiz: '${question}'`);
        response.status(200).json({
            statusText: 'Successfully created quiz',
            quiz: createdQuiz,
        });
    } catch (err) {
        // Failure to create quiz
        consola.error(`Failed to create quiz. Reason: `, err);
        response.status(500).json({
            statusText: `Failed to create quiz. Reason: ${err.message}`,
        });
    }
});

/**
 * @swagger
 * /api/lessons/quiz/{id}:
 *  put:
 *      summary:  Edit an existing quiz (TODO!)
 *      description: Edits an existing quiz.
 *      tags:
 *          - Quiz
 *      parameters:
 *          - name: id
 *            in: path
 *            required: true
 *            description: ID of the quiz to edit
 *            schema:
 *                type: string
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          questionType:
 *                              type: string
 *                          question:
 *                              type: string
 *                          answer:
 *                              type: string
 *      responses:
 *          '200':
 *               description: Succesfully edited quiz
 *               content:
 *                   application/json:
 *                       schema:
 *                           type: object
 *                           properties:
 *                               statusText:
 *                                   type: string
 *                               quiz:
 *                                   $ref: '#/components/schemas/Quiz'
 *          '404':
 *              description: Quiz with that ID doesn't exist
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              statusText:
 *                                  type: string
 */
quizRouter.put('/api/lessons/quiz/:id', async (request, response) => {
    throw new Error('Unimplemented');

    // try {
    //     const id = req.params.id;
    //     const { questionType, question, answer } = req.body;
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
 * /api/lessons/quiz/{id}:
 *  delete:
 *      summary:  Delete an existing quiz (TODO!)
 *      description: Deletes an existing quiz.
 *      tags:
 *          - Quiz
 *      parameters:
 *          - name: id
 *            in: path
 *            required: true
 *            description: ID of the quiz to delete
 *            schema:
 *                type: string
 *      responses:
 *          '200':
 *               description: Succesfully deleted quiz
 *               content:
 *                   application/json:
 *                       schema:
 *                           type: object
 *                           properties:
 *                               statusText:
 *                                   type: string
 *                               quiz:
 *                                   $ref: '#/components/schemas/Quiz'
 *          '404':
 *              description: Quiz with that ID doesn't exist
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              statusText:
 *                                  type: string
 */
quizRouter.delete('/api/lessons/quiz/:id', async (request, response) => {
    throw new Error('Unimplemented');

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

export default quizRouter;
