import mongoose from 'mongoose';
import { Course } from 'src/model/content/Course';

/**
 * The model defining a course in GalacticEd
 */
export interface UpdateCourseInput extends Course {}
