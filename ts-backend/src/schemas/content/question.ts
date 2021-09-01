import mongoose from 'mongoose';

const componentMongoSchema = new mongoose.Schema({
  /**
   * The data for the component.
   */
  componentData: String,
});

const questionMongoSchema = new mongoose.Schema({
  /**
   * Unique identifier for the lesson this is part of
   */
  // lessonId: String,
  /**
   * The components that are rendered by GalacticEd's component renderer
   * for this question.
   */
  data: [
    {
      row: Number,
      col: Number,
      width: Number,
      height: Number,
      componentName: String,
      data: String,
    },
  ],
  correctMessage: String,
});

export const QuestionModel = mongoose.model('questions', questionMongoSchema);
