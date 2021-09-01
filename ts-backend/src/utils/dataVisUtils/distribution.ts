import { LessonStatistics } from '../../model/statistics/LessonStatistics';
import { CourseActivityData } from '../../model/dataVisualisation/CourseActivityData';

export type CourseActivityMap = {
  // Maps course IDs to the lesson statistics under that course
  [k: string]: LessonStatistics[];
};

/**
 * Given an array of lesson statistics, aggregates each statistics
 * into the corresopnding course group and returns an array of course-wide statistics
 */
export const formCourseDistribution = (
  statistics: LessonStatistics[]
): CourseActivityMap => {
  const activityDataMap = {};
  return statistics.reduce(
    (activityMap: CourseActivityMap, stat: LessonStatistics) => {
      if (!stat.courseId) return activityMap;
      if (stat.courseId in activityMap) {
        activityMap[stat.courseId].push(stat);
      } else {
        activityMap[stat.courseId] = [stat];
      }
      return activityMap;
    },
    activityDataMap
  );
};
