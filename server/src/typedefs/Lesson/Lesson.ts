import mongoose from 'mongoose';
import { Quiz } from '../quiz/Quiz';

/**
 * Structs.sh lesson model
 */
export interface Lesson extends mongoose.Document {
    _id: string;
    rawMarkdown: string;
    creatorId: string;
    quizzes: string[];
    topicId: string;
}
