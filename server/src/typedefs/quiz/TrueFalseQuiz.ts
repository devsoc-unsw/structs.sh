import mongoose from 'mongoose';
import { BaseQuiz } from './Quiz';

/**
 * Structs.sh True/False Quiz Variant
 */
export interface TrueFalseQuiz extends BaseQuiz {
    isTrue: boolean;
    correctMessage: string;
    incorrectMessage: string;
    explanation: string;
}
