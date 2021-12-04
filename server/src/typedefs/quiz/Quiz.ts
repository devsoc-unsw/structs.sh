import mongoose from 'mongoose';
import { MultipleChoiceQuiz } from './MultipleChoice';
import { QuestionAnswerQuiz } from './QuestionAnswerQuiz';
import { TrueFalseQuiz } from './TrueFalseQuiz';

/**
 * Structs.sh Quiz model
 */
export interface BaseQuiz extends mongoose.Document {
    _id: string;
    question: string;
    description: string;
    type: string;
}

export type Quiz =
    | Partial<MultipleChoiceQuiz>
    | Partial<TrueFalseQuiz>
    | Partial<QuestionAnswerQuiz>;
