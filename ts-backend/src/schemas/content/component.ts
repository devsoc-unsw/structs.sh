import mongoose from 'mongoose';

/**
 * This is the model for a ticket in our admin/curator system.
 */
const componentMongoSchema = new mongoose.Schema({
  /**
   * The question id to which this component belongs - necessary so
   * that we can store props uniquely based on question!
   */
  questionId: String,
  /**
   * The data for the component.
   */
  componentData: String,
});

export const ComponentModel = mongoose.model(
  'components',
  componentMongoSchema
);
