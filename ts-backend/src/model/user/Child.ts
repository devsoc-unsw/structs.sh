import mongoose from 'mongoose';

/**
 * The user model for a child in the GalacticEd system.
 */
export interface Child extends mongoose.Document {
  /**
   * Unique identifier for the child
   */
  _id: string;
  /**
   * The name for a child. Necessary to differentiate between different children.
   */
  name: string;
  /**
   * The profile variables stored against the child
   */
  profile: {
    /**
     * Toggle 3d planets on and off.
     */
    threeDimensional: boolean;
    /**
     * Selected Avatar for the child - animal string
     */
    avatar: string;
    /**
     * Color of Avatar for the child - animal string
     */
    avatarColor: string;
  };
  /**
   * Date of birth for this child
   */
  dob: string;
  /**
   * Array of proficiency measures for each course the child has performance statistics for
   */
  proficiencyIds: string[];
  /**
   * Array of IDs corresponding to sessions the child has been prescribed
   */
  sessionIds: string[];
  /**
   * The current session the child is taking. When the session is complete, then
   * TODO: It would be better to just maintain an index into sessionIds rather than the value itself
   */
  currentSessionId: string;
  /**
   * Array of IDs corresponding to different learning profile configuration settings
   */
  learningProfileIds: string[];
}
