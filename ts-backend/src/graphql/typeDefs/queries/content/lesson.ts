import { gql } from 'graphql-tag';

export const lessonQueriesDef = gql`
  extend type Query {
    "Get all lessons currently in GalacticEd"
    getAllLessons: [Lesson]
    "Get a lesson by id"
    getLessonById(id: String): Lesson
    "Get lesson by ids"
    getLessonsById(lessonIds: [String]): [Lesson]
    "Get the questions within a lesson"
    getLessonQuestions(id: String): [Question]
  }
`;
