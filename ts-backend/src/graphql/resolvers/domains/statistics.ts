import { LessonStatistics } from 'src/model/statistics/LessonStatistics';
import { CreateLessonStatisticsInput } from '../../../model/input/statistics/CreateLessonStatisticsInput';
import { StatisticsMongoService } from '../../../dbHandlers/statistics';
import { TimeSeriesData } from 'src/model/dataVisualisation/TimeSeriesData';
import {
  formDayBins,
  findBinIndex,
} from '../../../utils/dataVisUtils/intervals';
import { subDays, getTime } from 'date-fns';
import { checkObjectIdIsValid } from '../../../utils';
import { CourseMongoService } from '../../../dbHandlers/content/course';
import { Course } from 'src/model/content/Course';
import { CourseActivityData } from 'src/model/dataVisualisation/CourseActivityData';
import {
  CourseActivityMap,
  formCourseDistribution,
} from '../../../utils/dataVisUtils/distribution';

const statisticsService = new StatisticsMongoService();
const courseService = new CourseMongoService();

/**
 * All resolvers for the Content Domain - here we look at lessons.
 */
export const statisticsResolver = {
  Query: {
    /**
     * Statistics fetching for display
     */
    getLessonStats: async (
      _,
      args: { childId: string; lessonId: string }
    ): Promise<LessonStatistics[]> => {
      const { childId, lessonId } = args;
      return await statisticsService.getChildStatistics(childId, lessonId, '');
    },
    /**
     * Gets the daily activity datapoints from a specified number of days ago until today
     * as a list sorted in ascending order of time.
     * If a the course or lesson ID was supplied, then only datapoints for that course or
     * lesson will be returned, otherwise datapoints from all courses and lessons will be
     * returned.
     */
    getActivitySince: async (
      _,
      args: {
        childId: string;
        daysAgo: number;
        lessonId: string;
        courseId: string;
      }
    ): Promise<TimeSeriesData[]> => {
      const { childId, daysAgo, lessonId, courseId } = args;
      checkObjectIdIsValid(childId);
      if (daysAgo < 0) throw new Error('Days ago must be a positive number');
      // TODO: It is an error to specify both course and lesson, but nothing bad will happen
      // TODO: add some endpoints for global statistics

      const statistics: LessonStatistics[] =
        await statisticsService.getChildStatistics(childId, lessonId, courseId);

      const fromTimestamp: number = getTime(subDays(Date.now(), daysAgo));
      const toTimestamp: number = getTime(Date.now());
      const series: TimeSeriesData[] = formDayBins(fromTimestamp, toTimestamp);

      statistics.forEach((stat) => {
        const binIndex = findBinIndex(series, stat.timeCreated * 1000);
        if (binIndex !== -1) {
          series[binIndex].value++;
        }
      });

      return series;
    },
    /**
     * Gets the daily activity datapoints from a starting timestamp to an ending timestamp,
     * both inclusive of the day they are in
     */
    getActivityInRange: async (
      _,
      args: { childId: string; fromTimestamp: number; toTimestamp }
    ): Promise<TimeSeriesData[]> => {
      const { childId, fromTimestamp, toTimestamp } = args;
      checkObjectIdIsValid(childId);
      if (fromTimestamp > toTimestamp) throw new Error('Invalid time range');

      const statistics: LessonStatistics[] =
        await statisticsService.getChildStatistics(childId, '', '');

      const series: TimeSeriesData[] = formDayBins(
        fromTimestamp * 1000,
        toTimestamp * 1000
      );

      statistics.forEach((stat) => {
        const binIndex = findBinIndex(series, stat.timeCreated * 1000);
        if (binIndex !== -1) {
          series[binIndex].value++;
        }
      });
      return series;
    },
    /**
     * Get activity distribution between different courses they have attempted for a child
     */
    getCourseActivityDistribution: async (
      _,
      args: { childId: string; daysAgo: number }
    ) => {
      const { childId, daysAgo } = args;
      checkObjectIdIsValid(childId);

      const statistics: LessonStatistics[] =
        await statisticsService.getChildStatistics(childId, '', '');

      const activity: CourseActivityMap = formCourseDistribution(statistics);
      console.log(activity);

      // Retrieve the document corresponding to each course ID
      // Fetch each course ID in parallel with Promise.all, then map results to CourseActivityData[], looking up activity
      const ids: string[] = Object.keys(activity);
      console.log(ids);
      const courseQueries: Promise<Course[]> = Promise.all(
        ids.map((id) => courseService.getCourseById(id))
      );
      const courses: Course[] = await courseQueries;
      const courseActivity: CourseActivityData[] = courses.map((course) => ({
        course: course,
        value: activity[course._id].length,
      }));

      console.log(courseActivity);
      return courseActivity;
    },
  },
  Mutation: {
    /**
     * Performance statistics recording
     */
    createLessonStatistics: async (
      _,
      args: { lessonStatistics: CreateLessonStatisticsInput }
    ) => {
      const { lessonStatistics } = args;
      // Processing the lesson statistics, assigning scores to each question,
      // setting a new proficiency, etc. before writing to the database
      const course: Course = await courseService.getCourseOfLesson(
        lessonStatistics.lessonId
      );
      const newLessonStatistics: any = {
        ...lessonStatistics,
        courseId: course._id,
        skillId: '',
        timeCreated: Math.floor(Date.now() / 1000),
        totalTime: 123,
        proficiency: 1,
        questionStatistics: lessonStatistics.questionStatistics.map((q) => {
          return {
            ...q,
            score: 0.65,
          };
        }),
      };

      // TODO: update child proficiency and update proficiency document
      return await statisticsService.createLessonStatistic(newLessonStatistics);
    },
  },
};
