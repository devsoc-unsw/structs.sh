import consola from 'consola';
import { Router } from 'express';
import { Lesson } from 'src/typedefs/lesson/Lesson';
import { Quiz } from 'src/typedefs/quiz/Quiz';
import { LessonMongoService } from '../database-helpers/lesson';
import { QuizMongoService } from '../database-helpers/quiz';

const quizRouter = Router();
const quizzesService = new QuizMongoService();
const lessonService = new LessonMongoService();

interface CreateQuizInput {
    lessonId: string;
    quizData: Quiz;
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
 *              description: Successfully fetched lesson's quizzes
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
 *                                     oneOf:
 *                                         - $ref: '#/components/schemas/MultipleChoiceQuiz'
 *                                         - $ref: '#/components/schemas/TrueFalseQuiz'
 *                                         - $ref: '#/components/schemas/QuestionAnswerQuiz'
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

        // Fetching quizzes
        const quizFetchQueries: Promise<Quiz>[] = lesson.quizzes.map((quizId) =>
            quizzesService.getQuizById(quizId)
        );
        const quizzes: Quiz[] = await Promise.all(quizFetchQueries);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        consola.success(`Successfully fetched quizzes for lesson: ${lessonId}`);
        console.log(quizzes);
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
 *      description: "Creates a new quiz and attaches it to a lesson's existing set of quizzes. Note: valid `type` values currently include `mc` for multiple choice, `tf` for true/false, `qa` for question-answer"
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
 *                          quizData:
 *                              oneOf:
 *                                  - $ref: '#/components/schemas/MultipleChoiceQuiz'
 *                                  - $ref: '#/components/schemas/TrueFalseQuiz'
 *                                  - $ref: '#/components/schemas/QuestionAnswerQuiz'
 *      responses:
 *          '200':
 *               description: Successfully created quiz for lesson
 *               content:
 *                   application/json:
 *                       schema:
 *                           type: object
 *                           properties:
 *                               statusText:
 *                                   type: string
 *                               quiz:
 *                                   oneOf:
 *                                       - $ref: '#/components/schemas/MultipleChoiceQuiz'
 *                                       - $ref: '#/components/schemas/TrueFalseQuiz'
 *                                       - $ref: '#/components/schemas/QuestionAnswerQuiz'
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
        const { lessonId, quizData } = request.body as CreateQuizInput;
        const { type } = quizData;

        // Ensure that the lesson exists
        const lesson: Lesson = await lessonService.getLessonById(lessonId);
        if (!lesson) {
            consola.error(`Lesson with ID '${lessonId}' does not exist`);
            return response.status(404).json({
                statusText: `Lesson with ID '${lessonId}' does not exist`,
            });
        }

        // Create a quiz question in database
        const createdQuiz = await quizzesService.createQuiz(quizData);

        // Add quiz question to database based on id
        let quizIds: string[] = lesson.quizzes || [];
        quizIds.push(createdQuiz._id);

        await lessonService.updateLessonById(
            lessonId,
            lesson.title,
            lesson.rawMarkdown,
            quizIds
        );

        consola.success(
            `Created quiz with ID: ${createdQuiz._id} on lesson ${lessonId}`
        );

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
 *                      oneOf:
 *                          - $ref: '#/components/schemas/MultipleChoiceQuiz'
 *                          - $ref: '#/components/schemas/TrueFalseQuiz'
 *                          - $ref: '#/components/schemas/QuestionAnswerQuiz'
 *      responses:
 *          '200':
 *               description: Successfully edited quiz
 *               content:
 *                   application/json:
 *                       schema:
 *                           type: object
 *                           properties:
 *                               statusText:
 *                                   type: string
 *                               quiz:
 *                                   oneOf:
 *                                       - $ref: '#/components/schemas/MultipleChoiceQuiz'
 *                                       - $ref: '#/components/schemas/TrueFalseQuiz'
 *                                       - $ref: '#/components/schemas/QuestionAnswerQuiz'
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
 *               description: Successfully deleted quiz
 *               content:
 *                   application/json:
 *                       schema:
 *                           type: object
 *                           properties:
 *                               statusText:
 *                                   type: string
 *                               quiz:
 *                                   oneOf:
 *                                       - $ref: '#/components/schemas/MultipleChoiceQuiz'
 *                                       - $ref: '#/components/schemas/TrueFalseQuiz'
 *                                       - $ref: '#/components/schemas/QuestionAnswerQuiz'
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
