// Docs: https://mongoosejs.com/docs/schematypes.html
// Note: quiz variants like multiple choice, true/false, etc. will each have different sets
//       of properties, however they will all be stored in one collection
// This is accomplished with Mongoose's 'discriminators'. See here: https://mongoosejs.com/docs/discriminators.html

import mongoose from 'mongoose';

const options = { discriminatorKey: 'quizType' };

const quizMongoSchema = new mongoose.Schema(
    {
        type: String,
        question: String,
        description: String,
    },
    options
);

export const QuizModel = mongoose.model('quiz', quizMongoSchema);

export const MultipleChoiceQuizModel = QuizModel.discriminator(
    'MultipleChoice',
    new mongoose.Schema({
        choices: [String],
        answers: [String],
        maxSelections: Number,
        correctMessage: String,
        incorrectMessage: String,
        explanation: String,
    })
);

export const TrueFalseQuizModel = QuizModel.discriminator(
    'TrueFalse',
    new mongoose.Schema({
        isTrue: Boolean,
        correctMessage: String,
        incorrectMessage: String,
        explanation: String,
    })
);

export const QuestionAnswerQuizModel = QuizModel.discriminator(
    'QuestionAnswer',
    new mongoose.Schema({
        answer: String,
        explanation: String,
    })
);
