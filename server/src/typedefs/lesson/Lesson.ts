import mongoose from 'mongoose';

/**
 * Structs.sh lesson model
 */
export interface Lesson extends mongoose.Document {
    _id: string;
    topicId: string;
    title: string;
    rawMarkdown: string;
    creatorId: string;
    quizzes: string[];
}
