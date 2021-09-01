import mongoose from 'mongoose';

/**
 * This is the model for a ticket in our admin/curator system.
 */
const lessonMongoSchema = new mongoose.Schema({
  /**
   * Identifier for the course a lesson is part of
   */
  courseId: String,
  /**
   * The title of the lesson, eg What's that Shape?
   */
  title: String,
  /**
   * The ids of questions that are in this lesson, in order
   */
  questionIds: [String],
  /**
   * Short description of the lesson
   */
  description: String,
  /**
   * The level of difficulty for this lesson
   */
  level: Number,
  /**
   * The instruction on how to complete the lesson
   */
  instruction: String,
  /**
   * Approximate expected duration of the lesson in seconds
   */
  duration: Number,
});

export const LessonModel = mongoose.model('lessons', lessonMongoSchema);
