import mongoose from 'mongoose';

const userMongoSchema = new mongoose.Schema({
  /**
   * The permissions for a user.
   */
  permissions: [String],
  /**
   * The username for a user. Could be email or chosen nickname.
   */
  username: String,
  /**
   * The email of a user. Important for notifications, and reports.
   */
  email: String,
  /**
   * The password of a user. Will be encrypted.
   */
  password: String,
  /**
   * The config variables stored against the user
   */
  config: {
    /**
     * Determines if a user wishes to stay signed in locally
     */

    keepSignedIn: Boolean,
    /**
     * The selected theme for a user. Only relevant for non-student use.
     * For students, will be space by default, right now.
     */
    theme: String,
  },
  /**
   * Array of children IDs connected to this user - perhaps as parent
   * or a therapist
   */
  childrenIds: { type: [String], required: false },
  /**
   * The active child id for this parent or therapist
   */
  activeChildId: { type: String, required: false },
});

export const UserModel = mongoose.model('users', userMongoSchema);
