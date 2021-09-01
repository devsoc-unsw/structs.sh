import gql from 'graphql-tag';

export const questionMutationsDef = gql`
  extend type Mutation {
    "Add a new question to a lesson in GalacticEd"
    createQuestion(question: CreateQuestionInput): Question
    "Update the details of a question in GalacticEd"
    updateQuestion(question: UpdateQuestionInput): Question
    "Delete a question from GalacticEd"
    deleteQuestion(id: String): String
  }
`;
