import mongoose from 'mongoose';

/**
 * The model for creating a course in GalacticEd
 */
export interface CreateCourseInput extends mongoose.Document {
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
