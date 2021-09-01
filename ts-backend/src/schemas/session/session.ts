import mongoose from 'mongoose';

const sessionStatisticsMongoSchema = new mongoose.Schema({
  /**
   * Lessons prescribed to the child in this session
   */
  lessonIds: [String],
  /**
   * Child ID this session is prescribed for
   */
  childId: String,
  /**
   * The currently active lesson
   */
  activeLessonId: String,
  /**
   * The UNIX timestamp for the time the session started
   */
  startTime: Number,
  /**
   * The UNIX timestamp for the time the session concluded
   */
  endTime: Number,
  /**
   * The prescribed duration, in seconds, that this therapy session should last for
   */
  duration: Number,
  /**
   * Whether all lessons prescribed in this session was fully completed or not
   */
  completed: Boolean,
});

export const SessionModel = mongoose.model(
  'session',
  sessionStatisticsMongoSchema
);
