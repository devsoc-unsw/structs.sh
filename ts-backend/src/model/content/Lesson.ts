import mongoose from 'mongoose';

/**
 * This is the model for a ticket in GalacticEd's admin/curator system.
 */
export interface Lesson extends mongoose.Document {
  /**
   * Unique identifier for a lesson
   */
  _id;
  /**
   * Identifier for the course a lesson is part of
   */
  courseId: string;
  /**
   * The title of the lesson, eg What's that Shape?
   */
  title: string;
  /**
   * The ids of questions that are in this lesson, in order
   */
  questionIds: string[];
  /**
   * Short description of the lesson
   */
  description: string;
  /**
   * The level of difficulty for this lesson
   */
  level: number;
  /**
   * The instruction on how to complete the lesson
   */
  instruction: string;
  /**
   * Approximate expected duration of the lesson in seconds
   */
  duration: number;
}
