import { CreateLessonStatisticsInput } from 'src/model/input/statistics/CreateLessonStatisticsInput';
import { LessonStatistics } from 'src/model/statistics/LessonStatistics';
import { LessonStatisticsModel } from '../schemas/statistics/lessonStatistics';

/**
 * Database controller for the user collection in GalacticEd
 */
export class StatisticsMongoService {
  /**
   * Create new lesson statistic
   */
  public async createLessonStatistic(
    lessonStatistic: any
  ): Promise<LessonStatistics> {
    try {
      const createLessonResponse = (await LessonStatisticsModel.create({
        ...lessonStatistic,
      })) as LessonStatistics;
      return createLessonResponse;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /**
   * Fetch lesson statistics for a child. If a lesson ID or course ID was supplied,
   * then only datapoints that are recorded for that lesson ID or course ID will
   * be retrieved.
   */
  public async getChildStatistics(
    childId: string,
    lessonId: string,
    courseId: string
  ): Promise<LessonStatistics[]> {
    try {
      if (!childId) throw new Error('No child ID given');

      // Conditionally adding more criteria to the filter
      const filter: any = { childId: childId };
      if (lessonId) filter['lessonId'] = lessonId;
      if (courseId) filter['courseId'] = courseId;

      const lessonStatistics = (await LessonStatisticsModel.find(
        filter
      )) as LessonStatistics[];
      return lessonStatistics;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /**
   * Gets all the statistics under a given session
   */
  public async getStatisticsInSession(
    sessionId: string
  ): Promise<LessonStatistics[]> {
    const lessonStatistics = (await LessonStatisticsModel.find({
      sessionId: sessionId,
    })) as LessonStatistics[];
    return lessonStatistics;
  }

  /**
   * Clears all the recorded statistics for a given session
   */
  public async deleteStatisticsInSession(sessionId: string): Promise<void> {
    const result = await LessonStatisticsModel.deleteMany({
      sessionId: sessionId,
    });
  }
}
