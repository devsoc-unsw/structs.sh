import mongoose from 'mongoose';

/**
 * Structs.sh Quiz model
 */
export interface Quiz extends mongoose.Document {
    _id: string;
    question_type: string;
    question: string;
    answer: string;
}
