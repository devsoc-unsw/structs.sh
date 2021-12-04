import { Quiz } from '../typedefs/quiz/Quiz';
import {
    MultipleChoiceQuizModel,
    QuestionAnswerQuizModel,
    TrueFalseQuizModel,
} from '../schemas/quiz/quiz';
import consola from 'consola';
import { MultipleChoiceQuiz } from 'src/typedefs/quiz/MultipleChoice';
import { TrueFalseQuiz } from 'src/typedefs/quiz/TrueFalseQuiz';
import { QuestionAnswerQuiz } from 'src/typedefs/quiz/QuestionAnswerQuiz';

/**
 * Database controller for the 'quizzes' collection
 */
export class QuizMongoService {
    /**
     * Create a new quiz
     */
    public async createQuiz(quizData: Quiz): Promise<Quiz> {
        try {
            ensureIsValidQuiz(quizData);

            let createQuizResponse: Quiz;

            // Determining what type of quiz question to create (either multiple choice, true/false or question-answer)
            switch (quizData.type) {
                case 'mc':
                    consola.info('Creating Multiple Choice quiz question');
                    ensureIsValidMC(quizData as MultipleChoiceQuiz);
                    createQuizResponse = (await MultipleChoiceQuizModel.create(
                        quizData
                    )) as MultipleChoiceQuiz;
                    break;
                case 'tf':
                    consola.info('Creating True/False quiz question');
                    ensureIsValidTF(quizData as TrueFalseQuiz);
                    createQuizResponse = (await TrueFalseQuizModel.create(
                        quizData
                    )) as TrueFalseQuiz;
                    break;
                case 'qa':
                    consola.info('Creating Question-Answer quiz question');
                    ensureIsValidQA(quizData as QuestionAnswerQuiz);
                    createQuizResponse = (await QuestionAnswerQuizModel.create(
                        quizData
                    )) as QuestionAnswerQuiz;
                    break;
                default:
                    consola.error(
                        `Failed to create quiz. Invalid question type: ${quizData.type}`
                    );
                    throw Error(`Invalid question type: '${quizData.type}'`);
            }
            return createQuizResponse;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    /**
     * Gets a quiz by ID
     */
    public async getQuizById(id: string): Promise<Quiz> {
        try {
            const quizResponse = (await MultipleChoiceQuizModel.findById(
                id
            )) as Quiz;
            return quizResponse;
        } catch (err) {
            throw new Error(err.message);
        }
    }
}

const ensureIsValidQuiz = (quizData: Quiz): void => {
    const { question, description } = quizData;
    if (question.length > 1000)
        throw Error('Question cannot be over 1000 characters');
    if (description.length > 10000)
        throw Error('Description cannot be over 10000 characters');
};

const ensureIsValidMC = (quizData: Partial<MultipleChoiceQuiz>): void => {
    const {
        choices,
        answers,
        maxSelections,
        correctMessage,
        incorrectMessage,
        explanation,
    } = quizData;

    if (!choices || choices.length === 0)
        throw Error('No choices were supplied');
    if (!answers || answers.length === 0)
        throw Error('No answers were supplied');
    if (choices.length != answers.length)
        throw Error('Choices and answers must be equal in length');
    if (maxSelections > choices.length)
        throw Error('Cannot select more choices than there actually are');

    if (correctMessage.length > 1000)
        throw Error('Correct message cannot be over 1000 characters');
    if (incorrectMessage.length > 1000)
        throw Error('Incorrect message cannot be over 1000 characters');
    if (explanation.length > 10000)
        throw Error('Explanation cannot be over 10000 characters');
};

const ensureIsValidTF = (quizData: Partial<TrueFalseQuiz>): void => {
    const { correctMessage, incorrectMessage, explanation } = quizData;

    if (correctMessage.length > 1000)
        throw Error('Correct message cannot be over 1000 characters');
    if (incorrectMessage.length > 1000)
        throw Error('Incorrect message cannot be over 1000 characters');
    if (explanation.length > 10000)
        throw Error('Explanation cannot be over 10000 characters');
};

const ensureIsValidQA = (quizData: Partial<QuestionAnswerQuiz>): void => {
    const { explanation } = quizData;
    if (explanation.length > 10000)
        throw Error('Explanation cannot be over 10000 characters');
};
