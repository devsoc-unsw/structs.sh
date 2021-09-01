/**
 * Model extended by all models that require a unique identifier
 */
export interface Identifiable {
  /**
   * The unique identifier for the particular model
   */
  _id: string;
}
