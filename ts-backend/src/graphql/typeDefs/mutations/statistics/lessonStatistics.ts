import gql from 'graphql-tag';

export const lessonStatisticsMutationsDef = gql`
  extend type Mutation {
    createLessonStatistics(
      lessonStatistics: LessonStatisticsInput
    ): LessonStatistics
  }
`;
