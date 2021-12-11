import mongoose from 'mongoose';

/**
 * Structs.sh Topic model
 */
export interface Topic extends mongoose.Document {
    _id: string;
    title: string;
    description: string;
    courses: string[];
    videos: string[];
    sourceCodeIds: string[];
    image: string;
}
