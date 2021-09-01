import mongoose from 'mongoose';
import { Lesson } from './Lesson';

/**
 * The model defining a course in GalacticEd
 */
export interface Course extends mongoose.Document {
  /**
   * The unique identiifer for a course
   */
  _id: string;
  /**
   * The name of a course
   */
  courseName: string;
  /**
   * The description for a course
   */
  description: string;
  /**
   * The planet texture for a course
   */
  planetId: PlanetTexture;
  /**
   * The creator user id of a course
   */
  creatorId: string;
  /**
   * The ids of lessons in a course
   */
  lessonIds: string[];
}

export interface CourseWithLessons {
  course: Course;
  lessons: Lesson[];
}

/**
 * The enforced planet textures GalacticEd has
 */
export type PlanetTexture =
  | 'jupiter'
  | 'mars'
  | 'pluto'
  | 'neptune'
  | 'moon'
  | 'mercury'
  | 'saturn';
