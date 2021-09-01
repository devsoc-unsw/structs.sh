import gql from 'graphql-tag';

export const lessonStatisticsTypeDefs = gql`
  type QuestionStatistics {
    "Number of incorrect clicks"
    numIncorrect: Int
    "Seconds taken to complete this question"
    timeTaken: Int
    "Score value computed by a function of num_incorrect, time_taken and aspects about the question itself, such as the number of clickable options"
    score: Float
  }

  type LessonStatistics {
    "The lesson that the activity is recorded for"
    lessonId: String
    "ID of the session that this lesson was completed under"
    sessionId: String
    "ID of the child that attempted this lesson"
    childId: String
    "ID of the course for this lesson"
    courseId: String
    "ID of the skill for this lesson"
    skillId: String
    "Difference between the end and start times"
    totalTime: Int
    "The UNIX timestamp for when the lesson was completed"
    timeCreated: Int
    "The new proficiency upon completing this lesson"
    proficiency: Float
    "List of questions and the child's performance in each of them"
    questionStatistics: [QuestionStatistics]
  }

  input QuestionStatisticsInput {
    "The time taken to complete the lesson, in seconds"
    timeTaken: Int
    "Number of incorrect clicks/attempts over the lesson"
    numIncorrect: Int
  }

  input LessonStatisticsInput {
    "ID of the session that's currently in progress"
    sessionId: String
    "ID of the child that completed the lesson"
    childId: String
    "ID of the lesson that this statistic is recorded for"
    lessonId: String
    "List of performance statistics for each question in the lesson"
    questionStatistics: [QuestionStatisticsInput]
  }
`;
