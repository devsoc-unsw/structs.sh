// Docs: https://mongoosejs.com/docs/schematypes.html
import mongoose from 'mongoose';

const sourceCodeMongoSchema = new mongoose.Schema({
    topicId: String,
    title: String,
    code: String,
});

export const SourceCodeModel = mongoose.model(
    'sourceCode',
    sourceCodeMongoSchema
);
