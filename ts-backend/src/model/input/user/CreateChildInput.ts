import mongoose from 'mongoose';

/**
 * The user model for adding a child to a parent in the GalacticEd system.
 */
export interface CreateChildInput extends mongoose.Document {
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
}
