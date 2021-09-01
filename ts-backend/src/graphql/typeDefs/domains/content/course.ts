import gql from 'graphql-tag';

export const courseTypeDefs = gql`
  "The model defining a course in GalacticEd"
  type Course {
    "The unique identiifer for a course"
    _id: String
    "The name of a course"
    courseName: String
    "The description for a course"
    description: String
    "The planet texture for a course"
    planetId: String
    "The creator user id of a course"
    creatorId: String
    "The ids of lessons in a course"
    lessonIds: [String]
  }

  "The model defining creating a course in GalacticEd"
  input CreateCourseInput {
    "The name of a course"
    courseName: String
    "The description for a course"
    description: String
    "The planet texture for a course"
    planetId: String
    "The creator user id of a course"
    creatorId: String
    "The ids of lessons in a course"
    lessonIds: [String]
  }

  "The model for updating a course in GalacticEd"
  input UpdateCourseInput {
    "The unique identiifer for a course"
    _id: String
    "The name of a course"
    courseName: String
    "The description for a course"
    description: String
    "The planet texture for a course"
    planetId: String
    "The creator user id of a course"
    creatorId: String
    "The ids of lessons in a course"
    lessonIds: [String]
  }

  "The model for a single course and all of its lessons"
  type CourseWithLessons {
    "The course document"
    course: Course
    "All lesson documents within this course"
    lessons: [Lesson]
  }
`;
