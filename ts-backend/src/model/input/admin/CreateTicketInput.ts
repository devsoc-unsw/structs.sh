import mongoose from 'mongoose';

/**
 * This is the model for creating ticket in our admin/curator system.
 */
export interface CreateTicketInput extends mongoose.Document {
  /**
   * The User who has created this ticket
   */
  createdBy: {
    /**
     * Full name of the user
     */
    name: string;
    /**
     * Avatar of this user (not important)
     */
    avatar?: string;
  };
  /**
   * The timestamp of the creation of this ticket
   */
  createdAt: string;
  /**
   * The type of request the ticket makes
   */
  request: string;
  /**
   * The description of this ticket
   */
  description: string;
}
