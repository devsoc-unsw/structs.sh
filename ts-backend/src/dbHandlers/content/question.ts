import { QuestionModel } from '../../schemas/content/question';
import { Question } from '../../model/content/Question';
import { CreateQuestionInput } from '../../model/input/content/CreateQuestionInput';
import { UpdateQuestionInput } from '../../model/input/content/UpdateQuestionInput';

/**
 * Database controller for the user collection in GalacticEd
 */
export class QuestionMongoService {
  /**
   * Get a question by id from GalacticEd's content system
   */
  public async getQuestionById(id: string): Promise<Question> {
    try {
      return (await QuestionModel.findById(id)) as Question;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /**
   * Create a new question for a lesson in GalacticEd
   */
  public async createQuestion(
    question: CreateQuestionInput
  ): Promise<Question> {
    try {
      return (await QuestionModel.create({
        ...question,
      })) as Question;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /**
   * Update an existing question in GalacticEd's content system
   */
  public async updateQuestion(
    question: UpdateQuestionInput
  ): Promise<Question> {
    try {
      await QuestionModel.updateOne({ _id: question._id }, { ...question });
      return (await QuestionModel.findById(question._id)) as Question;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /**
   * Delete a question from GalacticEd's content system
   */
  public async deleteQuestion(id: string): Promise<void> {
    try {
      await QuestionModel.deleteOne({ _id: id });
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
