import gql from 'graphql-tag';

export const lessonMutationsDef = gql`
  extend type Mutation {
    "Add a new lesson to GalacticEd"
    createLesson(lesson: CreateLessonInput): Lesson
    "Add a question to a lesson in GalacticEd"
    addQuestionToLesson(lessonId: String, questionId: String): Lesson
    "Update the details of a lesson in GalacticEd"
    updateLesson(lesson: UpdateLessonInput): Lesson
    "Delete a lesson from GalacticEd"
    deleteLesson(id: String): String

    "Update the questions for a given lesson"
    updateLessonQuestions(
      lessonId: String
      questions: [CreateQuestionInput]
    ): Lesson
  }
`;
