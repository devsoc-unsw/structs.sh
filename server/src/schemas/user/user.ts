import mongoose from 'mongoose';

const userMongoSchema = new mongoose.Schema({
    email: String,
    password: String,
});

export const UserModel = mongoose.model('users', userMongoSchema);
