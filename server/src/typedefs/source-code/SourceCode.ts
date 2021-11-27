import mongoose from 'mongoose';

/**
 * Structs.sh SourceCode model
 */
export interface SourceCode extends mongoose.Document {
    _id: string;
    title: string;
    code: string;
    topicId: string;
}
