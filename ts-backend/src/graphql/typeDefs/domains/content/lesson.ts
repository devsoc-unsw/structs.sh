import gql from 'graphql-tag';

export const lessonTypeDefs = gql`
  type Lesson {
    "Unique identifier for a lesson"
    _id: String
    "Identifier for the course a lesson is part of"
    courseId: String
    "The title of the lesson, eg What's that Shape?"
    title: String
    "The ids of questions that are in this lesson, in order"
    questionIds: [String]
    "Short description of the lesson"
    description: String
    "The level of difficulty for this lesson"
    level: Float
    "The instruction on how to complete the lesson"
    instruction: String
    "Approximate expected duration of the lesson in seconds"
    duration: Int
  }

  input CreateLessonInput {
    "Identifier for the course a lesson is part of"
    courseId: String
    "The title of the lesson, eg What's that Shape?"
    title: String
    "The ids of questions that are in this lesson, in order"
    questionIds: [String]
    "Short description of the lesson"
    description: String
    "The level of difficulty for this lesson"
    level: Float
    "The instruction on how to complete the lesson"
    instruction: String
    "Approximate expected duration of the lesson in seconds"
    duration: Int
  }

  input UpdateLessonInput {
    "Unique identifier for a lesson"
    _id: String!
    "Identifier for the course a lesson is part of"
    courseId: String
    "The title of the lesson, eg What's that Shape?"
    title: String
    "The ids of questions that are in this lesson, in order"
    questionIds: [String]
    "Short description of the lesson"
    description: String
    "The level of difficulty for this lesson"
    level: Float
    "The instruction on how to complete the lesson"
    instruction: String
    "Approximate expected duration of the lesson in seconds"
    duration: Int
  }
`;
