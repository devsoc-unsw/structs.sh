import gql from 'graphql-tag';

export const dataVisualisationQueriesDef = gql`
  extend type Query {
    "Gets the daily activity datapoints from a specified number of days ago until today as a list sorted in ascending order of time"
    getActivitySince(
      childId: String
      daysAgo: Int
      lessonId: String
      courseId: String
    ): [TimeSeriesData]
    "Gets the daily activity datapoints for a time range"
    getActivityInRange(
      childId: String
      fromTimestamp: Int
      toTimestamp: Int
    ): [TimeSeriesData]
    "Get activity distribution between different courses they have attempted for a child"
    getCourseActivityDistribution(
      childId: String
      daysAgo: Int
    ): [CourseActivityData]
  }
`;
