import mongoose from 'mongoose';

/**
 * The model for creating a new session for a child
 */
export interface UpdateSessionProgressInput extends mongoose.Document {
  /**
   * Unique identifier for a session
   */
  _id: string;
  /**
   * Lessons prescribed to the child in this session
   */
  lessonIds: string[];
  /**
   * The currently active lesson
   */
  activeLessonId: string;
  /**
   * The UNIX timestamp for the time the session started
   */
  startTime: number;
  /**
   * The UNIX timestamp for the time the session concluded
   */
  endTime: number;
  /**
   * Whether all lessons prescribed in this session was fully completed or not
   */
  completed: boolean;
}
