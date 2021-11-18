// Docs: https://mongoosejs.com/docs/schematypes.html
import mongoose from 'mongoose';

const lessonMongoSchema = new mongoose.Schema({
    topicId: String,
    title: String,
    rawMarkdown: String,
    creatorId: String,
    quizzes: [String],
});

export const LessonModel = mongoose.model('lesson', lessonMongoSchema);
