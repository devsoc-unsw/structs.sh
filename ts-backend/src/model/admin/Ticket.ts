import mongoose from 'mongoose';

/**
 * This is the model for a ticket in GalacticEd's admin/curator system.
 */
export interface Ticket extends mongoose.Document {
  /**
   * Unique identifier for a raised ticket
   */
  _id: string;
  /**
   * The User who has created this ticket
   */
  createdBy: {
    /**
     * Name of the user
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
   * The approval status of this ticket
   */
  status: Status;
  /**
   * The description of this ticket
   */
  description: string;
}

/**
 * The different stages of status a ticket can have
 */
export type Status = 'pending' | 'approved' | 'rejected';
