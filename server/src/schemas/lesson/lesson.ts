// Docs: https://mongoosejs.com/docs/schematypes.html
import mongoose from 'mongoose';

const lessonMongoSchema = new mongoose.Schema({
    rawMarkdown: String,
    creatorId: String,
    quizzes: [String],
});

export const LessonModel = mongoose.model('lesson', lessonMongoSchema);
