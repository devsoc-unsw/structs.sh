import mongoose from 'mongoose';

/**
 * This is the model for a ticket in our admin/curator system.
 */
const ticketMongoSchema = new mongoose.Schema({
  /**
   * The User who has created this ticket
   */
  createdBy: {
    /**
     * Name of the user
     */
    name: String,
    /**
     * Avatar of this user (not important)
     */
    avatar: String,
  },
  /**
   * The timestamp of the creation of this ticket
   */
  createdAt: String,
  /**
   * The type of request the ticket makes
   */
  request: String,
  /**
   * The approval status of this ticket
   */
  status: String,
  /**
   * The description of this ticket
   */
  description: String,
});

export const TicketModel = mongoose.model('tickets', ticketMongoSchema);
