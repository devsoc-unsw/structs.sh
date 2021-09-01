import mongoose from 'mongoose';

/**
 * This is the model for a ticket in our admin/curator system.
 */
const courseMongoSchema = new mongoose.Schema({
  /**
   * The name of a course
   */
  courseName: String,
  /**
   * The description for a course
   */
  description: String,
  /**
   * The planet texture for a course
   */
  planetId: String,
  /**
   * The creator user id of a course
   */
  creatorId: String,
  /**
   * The ids of lessons in a course
   */
  lessonIds: [String],
});

export const CourseModel = mongoose.model('courses', courseMongoSchema);
