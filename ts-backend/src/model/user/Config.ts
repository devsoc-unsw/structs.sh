import { Theme } from "./Theme";

/**
 * This is all of the key config variables necessary in the User's experience in GalacticEd.
 */
export interface Config {
  /**
   * Determines if a user wishes to stay signed in locally
   */
  keepSignedIn: boolean;
  /**
   * The selected theme for a user. Only relevant for non-student use.
   * For students, will be space by default, right now.
   */
  theme: Theme;
}
