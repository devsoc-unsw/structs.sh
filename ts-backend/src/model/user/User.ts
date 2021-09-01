import mongoose from 'mongoose';
import { Config } from './Config';
import { Permission } from './Permissions';

/**
 * The model for a user of GalacticEd. This will include Admin, Curator and Student.
 */
export interface User extends mongoose.Document {
  /**
   * The unique identifier for a User
   */
  _id: string;
  /**
   * The permissions for a user.
   */
  permissions: Permission[];
  /**
   * The username for a user. Could be email or chosen nickname.
   */
  username: string;
  /**
   * The email of a user. Important for notifications, and reports.
   */
  email: string;
  /**
   * The password of a user. Will be encrypted.
   */
  password: string;
  /**
   * The config variables stored against the user
   */
  config: Config;
  /**
   * Array of children IDs connected to this user - perhaps as parent
   * or a therapist
   */
  childrenIds: string[];
  /**
   * The active child id for this parent or therapist
   */
  activeChildId: string;
}
