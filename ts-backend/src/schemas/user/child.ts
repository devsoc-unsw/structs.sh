import mongoose from 'mongoose';

const childMongoSchema = new mongoose.Schema({
  /**
   * The name for a child. Necessary to differentiate between different children.
   */
  name: String,
  /**
   * The profile variables stored against the child
   */
  profile: {
    /**
     * Toggle 3d planets on and off.
     */
    threeDimensional: Boolean,
    /**
     * Selected Avatar for the child - animal string
     */
    avatar: String,
    /**
     * Color of Avatar for the child - animal string
     */
    avatarColor: String,
  },
  /**
   * Date of birth for this child
   */
  dob: String,
  /**
   * Array of proficiency measures for each course the child has performance statistics for
   */
  proficiencyIds: [String],
  /**
   * Array of IDs corresponding to sessions the child has been prescribed
   */
  sessionIds: [String],
  /**
   * The current session the child is taking. When the session is complete, then
   */
  currentSessionId: String,
  /**
   * Array of IDs corresponding to different learning profile configuration settings
   */
  learningProfileIds: [String],
});

export const ChildModel = mongoose.model('childs', childMongoSchema);
