import mongoose from 'mongoose';

/**
 * Structs.sh user model
 */
export interface User extends mongoose.Document {
    _id: string;
    email: string;
    password: string;
}
