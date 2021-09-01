import mongoose from 'mongoose';
import { Course } from '../content/Course';
import { Lesson } from '../content/Lesson';

export interface Session extends mongoose.Document {
  /**
   * Unique identifier for a session
   */
  _id: string;
  /**
   * Lessons prescribed to the child in this session
   */
  lessonIds: string[];
  /**
   * Child ID this session is prescribed for
   */
  childId: string;
  /**
   * The currently active lesson
   * TODO: it would be better to just maintain the index of lessonIds rather than the value itself
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
   * The prescribed duration, in seconds, that this therapy session should last for
   */
  duration: number;
  /**
   * Whether all lessons prescribed in this session was fully completed or not
   */
  completed: boolean;
}

// Bundles the lesson and its parent course together
export interface LessonAndCourse {
  lesson: Lesson;
  /**
   * The course that this lesson is under
   */
  course: Course;
}

// Contains all fields necessary to populate the student dashboard
export interface FullSession {
  /**
   * Unique identifier for a session
   */
  _id: string;
  /**
   * Lessons prescribed to the child in this session
   */
  lessons: LessonAndCourse[];
  /**
   * The currently active lesson
   * TODO: it would be better to just maintain the index of lessonIds rather than the value itself
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
   * The prescribed duration, in seconds, that this therapy session should last for
   */
  duration: number;
  /**
   * Whether all lessons prescribed in this session was fully completed or not
   */
  completed: boolean;
}
