import gql from 'graphql-tag';

export const courseMutationsDef = gql`
  extend type Mutation {
    "Add a new course to GalacticEd"
    createCourse(course: CreateCourseInput): Course
    "Update the details of a course in GalacticEd"
    updateCourse(course: UpdateCourseInput): Course
    "Delete a course from GalacticEd"
    deleteCourse(id: String): String
  }
`;
