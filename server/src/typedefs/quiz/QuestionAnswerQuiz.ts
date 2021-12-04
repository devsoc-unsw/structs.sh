import mongoose from 'mongoose';
import { BaseQuiz } from './Quiz';

/**
 * Structs.sh Question/Answer Quiz Variant
 */
export interface QuestionAnswerQuiz extends BaseQuiz {
    answer: string;
    explanation: string;
}
