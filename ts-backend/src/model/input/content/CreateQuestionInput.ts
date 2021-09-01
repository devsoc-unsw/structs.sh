/**
 * This is the model for creating a question that is part of a lesson
 */

import { Component } from 'src/model/content/Component';

export interface CreateQuestionInput {
  /**
   * Unique identifier for the lesson this is part of
   */
  // lessonId: string;
  /**
   * The components that are rendered by GalacticEd's component renderer
   * for this question.
   */
  components: Component[];
  /**
   * The message to display when the correct answer has been entered.
   * If this is not provided, do not show a correct response screen and
   * simply go to the next question!
   */
  correctMessage?: string;
}
