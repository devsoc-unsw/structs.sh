import mongoose from 'mongoose';

const lessonMongoSchema = new mongoose.Schema({
    rawMarkdown: String,
    creatorId: String,
    quizs: [],
});

export const LessonModel = mongoose.model('lesson', lessonMongoSchema);