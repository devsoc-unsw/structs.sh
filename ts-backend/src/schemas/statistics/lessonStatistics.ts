import mongoose from 'mongoose';

const lessonStatisticsMongoSchema = new mongoose.Schema({
  /**
   * The lesson that the activity is recorded for
   */
  lessonId: String,
  /**
   * ID of the session that this lesson was completed under
   */
  sessionId: String,
  /**
   * ID of the child that attempted this lesson
   */
  childId: String,
  /**
   * ID of the course for this lesson
   */
  courseId: String,
  /**
   * ID of the skill for this lesson
   */
  skillId: String,
  /**
   * Difference between the end and start times
   */
  totalTime: Number,
  /**
   * The number of incorrect clicks
   */
  timeCreated: Number,
  /**
   * The new proficiency upon completing this lesson
   */
  proficiency: Number,
  /**
   * List of questions and the child's performance in each of them
   */
  questionStatistics: [
    {
      /**
       * Number of incorrect clicks
       */
      numIncorrect: Number,
      /**
       * Seconds taken to complete this question
       */
      timeTaken: Number,
      /**
       * Score value computed by a function of numIncorrect, timeTaken and aspects about the question
       * itself, such as the number of clickable options
       */
      score: Number,
    },
  ],
});

export const LessonStatisticsModel = mongoose.model(
  'lessonStatistics',
  lessonStatisticsMongoSchema
);
