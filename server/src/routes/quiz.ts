import { Router } from 'express';
import { QuizMongoService } from '../database-helpers/quiz';
import consola from 'consola';
import { createQualifiedName } from 'typescript';

const quizRouter = Router();
const quizService = new QuizMongoService();

interface CreateQuizInput {
    lessonId: string,
    questionType: string,
    question: string,
    answer: string,
}

/*
 * Create a new quiz and adds it to a particular lesson

 * Params
    - lessonId
 * Response
    - List of quizzes for a lesson
 * Excaptions
    - lessonId doesn't correspond to an existing lesson



 * Method
    - Search for lesson by lessonId
    - If lesson doesn't exist raise exception
 */
/*
quizRouter.post('/api/lessons/quiz', async (request, response) => {
    try {
        const { question_type, question, answer } = request.body as CreateQuizInput;
        console.log(`Question to create : ${question} of type : ${question_type} with answer : ${answer}`);
        console.log(request.body);
        
        consola.error(`Failed to create quiz`);
        response.status(401).json({
            status: 401,
            statusText: 'Code not implemented yet',
        });
        
    } catch (err) {
        // Failure to create quiz
        consola.error(`Failed to create quiz`);
        response.status(401).json({
            status: 401,
            statusText: 'Code not implemented yet, caught error',
        });
    }
});
*/

/*
 * Create a new quiz and adds it to a particular lesson

 * Params
    - lessonId (str)
    - questionType (str)
    - question (str)
    - answer (str)
 * Response
    - lesson
 * Excaptions
    - lessonId doesn't correspond to an existing lesson
    - questionType must be one of the strings: 'mc' (multiple choice) or 'qa' (question-answer format)



 * Method
    - Search for lesson by lessonId
    - If lesson doesn't exist raise exception
    - ...
 */
quizRouter.post('/api/lessons/quiz', async (request, response) => {
    try {
        const { lessonId, questionType, question, answer } = request.body as CreateQuizInput;
        console.log(`Question to create : ${question} of type : ${questionType} with answer : ${answer}`);
        console.log(request.body);

        // Retrieve lesson/check lesson exists

        // Check if valid questionType
        if (!["mc", "qa"].includes(questionType)) {
            consola.error(`Failed to create quiz`);
            response.status(401).json({
                status: 401,
                statusText: 'Invalid question type: must be one of the strings: \'mc\' (multiple choice) or \'qa\' (question-answer format)',
            });
            return;
        }

        // Create a quiz question in database
        const createdQuiz = await quizService.createQuiz(questionType, question, answer);
        console.log(`Created quiz with id ${createdQuiz._id}`);


        // Add quiz question to database based on id
        
        consola.success(`Successfully created quiz: ${question}`);
        response.status(200).json({
            status: 200,
            statusText: 'Successfully created quiz',
            data: createdQuiz,
            // data: { 'lesson': 'TODO: RETURN LESSON HERE' },
        });
        
    } catch (err) {
        // Failure to create quiz
        consola.error(`Failed to create quiz`);
        response.status(401).json({
            status: 401,
            statusText: 'Invalid input',
        });
    }
});

export default quizRouter;
