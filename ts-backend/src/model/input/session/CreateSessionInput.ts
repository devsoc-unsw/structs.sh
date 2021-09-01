import mongoose from 'mongoose';

/**
 * The model for creating a new session for a child
 */
export interface CreateSessionInput extends mongoose.Document {
  /**
   * Lessons prescribed to the child in this session
   */
  lessonIds: string[];
  /**
   * Child ID this session is prescribed for
   */
  childId: string;
  /**
   * The prescribed duration, in seconds, that the therapy session should last for
   */
  duration: number;
}
