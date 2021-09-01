import mongoose from 'mongoose';
import { Component } from './Component';

/**
 *
 */
interface ComponentData {
  row: Number;
  col: Number;
  width: Number;
  height: Number;
  componentName: String;
  data: String;
}

/**
 * This is the model for a question that is part of a lesson
 */
export interface Question extends mongoose.Document {
  /**
   * The unique identifier for a Question
   */
  _id: string;
  /**
   * The components that are rendered by GalacticEd's component renderer
   * for this question.
   */
  data: ComponentData[];
  /**
   * The message to display when the correct answer has been entered.
   * If this is not provided, do not show a correct response screen and
   * simply go to the next question!
   */
  correctMessage?: string;
}
