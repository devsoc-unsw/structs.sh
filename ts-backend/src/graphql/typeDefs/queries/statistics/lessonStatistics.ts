import gql from 'graphql-tag';

export const lessonStatisticsQueriesDef = gql`
  extend type Query {
    "Get the performance stats for a lesson for a child"
    getLessonStats(childId: String, lessonId: String): [LessonStatistics]
  }
`;
