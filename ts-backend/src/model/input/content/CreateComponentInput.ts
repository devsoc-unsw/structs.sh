import mongoose from 'mongoose';

/**
 * This is the model for creating each component rendered in a question
 */

export interface CreateComponentInput extends mongoose.Document {
  /**
   * The question id to which this component belongs - necessary so
   * that we can store props uniquely based on question!
   */
  questionId: string;
  /**
   * The type of component - this is enforced by GalacticEd's library
   * of available components
   */
  componentType: string;
  /**
   * The props for a component - this could have any data inside it,
   * besides the absolute requirement of a position. For now, we'll
   * type it as any before we have a more concrete understanding of its
   * restrictions.
   */
  componentProps: any;
}
