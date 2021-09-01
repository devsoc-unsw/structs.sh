import { gql } from 'graphql-tag';

export const courseQueriesDef = gql`
  extend type Query {
    "Get all courses currently in GalacticEd"
    getAllCourses: [Course]
    "Get a course by id"
    getCourseById(id: String): Course
    "Gets the basic descriptions for all courses and the basic descriptions for all their lessons. Useful for high-level navigation components and rendering the skill tree"
    getCoursesWithLessons: [CourseWithLessons]
    "Get a course by its name"
    getCourseByName(courseName: String): Course
    "Gets the course that contains the lesson ID"
    getCourseOfLesson(lessonId: String): Course
  }
`;
