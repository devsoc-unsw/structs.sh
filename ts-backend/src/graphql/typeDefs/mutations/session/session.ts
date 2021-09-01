import gql from 'graphql-tag';

export const sessionMutationsDef = gql`
  extend type Mutation {
    "Creates a new session of prescribed lessons for a child"
    createSession(session: CreateSessionInput): Session
    "Updates an existing session's properties (not progress)"
    updateSessionProperties(session: UpdateSessionPropertiesInput): Session
    "Deletes an existing session"
    deleteSession(childId: String, sessionId: String): Session

    "Sets the current session the child should be doing"
    setChildCurrentSession(childId: String, sessionId: String): Child
    "Updates an existing session's progress"
    updateSessionProgress(session: UpdateSessionProgressInput): Session
    "Progresses the child to the next session. Returns whether it was possible or not to progress the child to the next session"
    progressChildToNextSession(childId: String): Boolean
    "Progresses the child to the next lesson in this session, if it exists, otherwise marks the completion of this session"
    progressToNextLesson(sessionId: String): Session
    "Starts the session. Only affects the session document when the first question of the first lesson is started"
    startSession(sessionId: String): Session

    "Creates a new session using the recommendation engine"
    recommendSession(childId: String): Question
  }
`;
