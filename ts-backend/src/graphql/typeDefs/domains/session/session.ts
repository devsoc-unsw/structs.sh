import gql from 'graphql-tag';

export const sessionTypeDefs = gql`
  type Session {
    "Unique identifier for a session"
    _id: String
    "Lessons prescribed to the child in this session"
    lessonIds: [String]
    "Child ID this session is prescribed for"
    childId: String
    "The currently active lesson"
    activeLessonId: String
    "The UNIX timestamp for the time the session started"
    startTime: Int
    "The UNIX timestamp for the time the session concluded"
    endTime: Int
    "The prescribed duration, in seconds, that the therapy session should last for"
    duration: Int
    "Whether all lessons prescribe in this session was fully completed or not"
    completed: Boolean
  }

  "Bundles the lesson and its parent course together"
  type LessonAndCourse {
    lesson: Lesson
    "The course that this lesson is under"
    course: Course
  }

  "Sessions populated with lesson data. This should be used in the student side to render lessons"
  type FullSession {
    "Unique identifier for a session"
    _id: String
    "Lessons prescribed to the child in this session"
    lessons: [LessonAndCourse]
    "The currently active lesson"
    activeLessonId: String
    "The UNIX timestamp for the time the session started"
    startTime: Int
    "The UNIX timestamp for the time the session concluded"
    endTime: Int
    "The prescribed duration, in seconds, that the therapy session should last for"
    duration: Int
    "Whether all lessons prescribe in this session was fully completed or not"
    completed: Boolean
  }

  input CreateSessionInput {
    "Lessons prescribed to the child in this session"
    lessonIds: [String]
    "For which child the session is intended for"
    childId: String
    "The duration, in seconds, that this session is prescribed for"
    duration: Int
  }

  "This should only be used on the student side to update progress, not session properties."
  input UpdateSessionProgressInput {
    "The unique identiifer for a session"
    _id: String
    "Lessons prescribed to the child in this session"
    lessonIds: [String]
    "The currently active lesson"
    activeLessonId: String
    "The UNIX timestamp for the time the session started"
    startTime: Int
    "The UNIX timestamp for the time the session concluded"
    endTime: Int
    "Whether all lessons prescribe in this session was fully completed or not"
    completed: Boolean
  }

  "This should only be used on the admin side to update session properties, not progress."
  input UpdateSessionPropertiesInput {
    "The unique identiifer for a session"
    _id: String
    "Lessons prescribed to the child in this session"
    lessonIds: [String]
    "The currently active lesson"
    activeLessonId: String
    "The UNIX timestamp for the time the session concluded"
    endTime: Int
    "The duration, in seconds, that this session is prescribed for"
    duration: Int
  }
`;
