import mongoose from 'mongoose';

interface CreateQuestionStatisticsInput {
  /**
   * The time taken to complete the lesson, in seconds
   */
  timeTaken: number;
  /**
   * Number of incorrect clicks/attempts over the lesson
   */
  numIncorrect: number;
}

/**
 * The user model for adding a child to a parent in the GalacticEd system.
 */
export interface CreateLessonStatisticsInput extends mongoose.Document {
  /**
   * ID of the session that's currently in progress
   */
  sessionId: string;
  /**
   * ID of the child that completed the lesson
   */
  childId: string;
  /**
   * ID of the lesson that this statistic is recorded for
   */
  lessonId: string;
  /**
   * List of performance statistics for each question in the lesson
   */
  questionStatistics: CreateQuestionStatisticsInput[];
}
