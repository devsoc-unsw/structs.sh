import mongoose from 'mongoose';

/**
 * This is the model for a ticket in GalacticEd's admin/curator system.
 */
export interface LessonStatistics extends mongoose.Document {
  /**
   * The lesson that the activity is recorded for
   */
  lessonId: string;
  /**
   * ID of the session that this lesson was completed under
   */
  sessionId: string;
  /**
   * ID of the child that attempted this lesson
   */
  childId: string;
  /**
   * ID of the course for this lesson
   */
  courseId: string;
  /**
   * ID of the skill for this lesson
   */
  skillId: string;
  /**
   * Difference between the end and start times
   */
  totalTime: number;
  /**
   * UNIX timestamp for when the statistic was recorded on
   */
  timeCreated: number;
  /**
   * The new proficiency upon completing this lesson
   */
  proficiency: number;
  /**
   * List of questions and the child's performance in each of them
   */
  questionStatistics: [
    {
      /**
       * Number of incorrect clicks
       */
      numIncorrect: number;
      /**
       * Seconds taken to complete this question
       */
      timeTaken: number;
      /**
       * Score value computed by a function of num_incorrect, time_taken and aspects about the question
       * itself, such as the number of clickable options
       */
      score: number;
    }
  ];
}
