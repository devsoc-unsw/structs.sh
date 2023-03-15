import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
    name: String,
    age: Number
})

module.exports = mongoose.model("test", testSchema);