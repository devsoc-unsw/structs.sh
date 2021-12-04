import mongoose from 'mongoose';
import { BaseQuiz } from './Quiz';

/**
 * Structs.sh Multiple Choice Quiz Variant
 */
export interface MultipleChoiceQuiz extends BaseQuiz {
    choices: string[];
    answers: boolean[];
    maxSelections: number;
    correctMessage: string;
    incorrectMessage: string;
    explanation: string;
}
