import { LessonModel } from '../../schemas/content/lesson';
import { Lesson } from 'src/model/content/Lesson';
import { CreateLessonInput } from 'src/model/input/content/CreateLessonInput';
import { UpdateLessonInput } from 'src/model/input/content/UpdateLessonInput';
import { Question } from 'src/model/content/Question';
import { CreateQuestionInput } from 'src/model/input/content/CreateQuestionInput';
import { QuestionModel } from '../../schemas/content/question';
import { ObjectId } from 'mongoose';
import { CourseModel } from '../../schemas/content/course';
import { checkObjectIdIsValid } from '../../utils';

/**
 * Database controller for the user collection in GalacticEd
 */
export class LessonMongoService {
  /**
   * Get all Lessons stored in GalacticEd
   */
  public async getAllLessons(): Promise<Lesson[]> {
    try {
      return (await LessonModel.find({})) as Lesson[];
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /**
   * Get a lesson by id from GalacticEd's content system
   */
  public async getLessonById(id: string): Promise<Lesson> {
    try {
      return (await LessonModel.findById(id)) as Lesson;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /**
   * Get lessons by ids from GalacticEd's content system
   */
  public async getLessonsById(lessonIds: string[]): Promise<Lesson[]> {
    try {
      lessonIds.forEach((id) => checkObjectIdIsValid(id));
      const lessons = (await LessonModel.find({
        _id: { $in: lessonIds },
      })) as Lesson[];
      const lessonsInOrder: Lesson[] = [];
      for (const lessonId of lessonIds) {
        lessonsInOrder.push(
          lessons.filter((lesson) => {
            return String(lesson._id) === lessonId;
          })[0]
        );
      }
      if (lessons.length !== lessonIds.length)
        throw new Error(
          `Failed to fetch lessons successfully. Lesson IDs must correspond to 1 existing lesson`
        );
      return lessonsInOrder;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  public async getLessonQuestions(id: string): Promise<Question[]> {
    try {
      const lesson = (await LessonModel.findById(id)) as Lesson;
      const questions = (await QuestionModel.find({
        _id: {
          $in: lesson.questionIds,
        },
      })) as Question[];
      return questions;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /**
   * Create a new lesson in GalacticEd's content system
   */
  public async createLesson(lesson: CreateLessonInput): Promise<Lesson> {
    try {
      const createdLesson = (await LessonModel.create({
        ...lesson,
      })) as Lesson;
      const createdLessonId = createdLesson._id;
      const courseId = lesson.courseId;
      await CourseModel.updateOne(
        { _id: courseId },
        { $push: { lessonIds: createdLessonId } }
      );
      return createdLesson;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /**
   * Update an existing lesson in GalacticEd's content system
   */
  public async updateLesson(lesson: UpdateLessonInput): Promise<Lesson> {
    try {
      await LessonModel.updateOne({ _id: lesson._id }, { ...lesson });
      return (await LessonModel.findById(lesson._id)) as Lesson;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  public async updateLessonQuestions(
    lessonId: string,
    newQuestions: CreateQuestionInput[]
  ): Promise<Lesson> {
    const lesson = (await LessonModel.findById(lessonId)) as Lesson;
    const oldQuestionIds = lesson.questionIds;
    // Delete all documents associated with old question IDs
    try {
      const res = await QuestionModel.deleteMany({
        _id: {
          $in: oldQuestionIds.filter((id) => !!id),
        },
      });
      console.log('===== DELETED SUCCESSFULLY =====');
      console.log(res);
    } catch (err) {
      console.log('===== DELETION FAILED =====');
      console.log(err);
    }
    // Inserting many new question documents and reassigning their IDs to the lesson's question_ids field
    try {
      const res = await QuestionModel.insertMany(newQuestions);
      console.log('===== INSERTED SUCCESSFULLY =====');
      console.log(res);
      const newQuestionIds: string[] = res.map((opResult) => opResult._id);
      lesson.questionIds = newQuestionIds;
      await lesson.save();
      console.log('===== Saved Lesson =====');
      console.log('New IDs: ', newQuestionIds);
      return lesson;
    } catch (err) {
      console.log('===== INSERTION FAILURE =====');
      console.log(err);
      return lesson;
    }
  }

  /**
   * Add a question id to an existing lesson in GalacticEd's content system
   */
  public async addQuestionToLesson(
    lessonId: string,
    questionId: string
  ): Promise<Lesson> {
    try {
      await LessonModel.updateOne(
        { _id: lessonId },
        { $push: { questionIds: questionId } }
      );
      return await this.getLessonById(lessonId);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /**
   * Delete a lesson from GalacticEd's content system
   */
  public async deleteLesson(id: string): Promise<void> {
    try {
      await LessonModel.deleteOne({ _id: id });
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
