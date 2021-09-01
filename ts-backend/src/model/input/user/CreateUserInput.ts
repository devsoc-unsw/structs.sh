/**
 * Interface for the input required increating a user
 */
export interface CreateUserInput {
  /**
   * The permissions for a user - admin and/or curator and/or student.
   */
  permissions: [string];
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
   * The config variables stored against the user.
   */
  config: CreateConfig;
}

/**
 * Interface for the config input required in creating a user
 */
interface CreateConfig {
  /**
   * The selected theme for a user. Only relevant for non-student use. For students, will be space by default, right now.
   */
  theme: string;
  /**
   * Determines if a user wishes to stay signed in locally.
   */
  keepSignedIn: boolean;
}
