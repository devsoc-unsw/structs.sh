import mongoose from 'mongoose';

const lessonMongoSchema = new mongoose.Schema({
    rawMarkdown: String,
    creatorId: String,
    quizzes: [],
});

export const LessonModel = mongoose.model('lesson', lessonMongoSchema);
