import mongoose from "mongoose";

interface ITodo {
    title: string;
    description: string;
}

interface todoModelInterface extends mongoose.Model<TodoDoc> {
    build(attr: ITodo): TodoDoc
}

interface TodoDoc extends mongoose.Document {
    title: string;
    description: string;
}

const toDoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
})


toDoSchema.statics.build = (attr: ITodo) => {
    return new Todo(attr)
}

const Todo = mongoose.model<TodoDoc, todoModelInterface>("ToDo", toDoSchema);

export { Todo }