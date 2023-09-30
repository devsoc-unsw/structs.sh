<<<<<<< HEAD
import mongoose from "mongoose";

interface IUsers {
    username: string;
    password: string;
}

interface UserModelInterface extends mongoose.Model<UserDoc> {
    build(attr: IUsers): UserDoc
}

interface UserDoc extends mongoose.Document {
    username: string;
    password: string;
}

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})


UserSchema.statics.build = (attr: IUsers) => {
    return new users(attr)
}

const users = mongoose.model<UserDoc, UserModelInterface>("Users", UserSchema);

export { users as users }
=======
import mongoose from 'mongoose';

interface IUsers {
  username: string;
  password: string;
}

interface UserModelInterface extends mongoose.Model<UserDoc> {
  build: (attr: IUsers) => UserDoc;
}

interface UserDoc extends mongoose.Document {
  username: string;
  password: string;
}

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.statics.build = (attr: IUsers) => {
  return new users(attr);
};

const users = mongoose.model<UserDoc, UserModelInterface>('Users', UserSchema);

export { users };
>>>>>>> 9664a69cb9210b8ac89d475b837fc4b5aac3b250
