import gql from 'graphql-tag';

export const dataVisualisationTypeDefs = gql`
  type TimeSeriesData {
    "Date this activity is recorded for, as a UNIX timestamp. Using Float due to 32-bit int size limits"
    timestamp: Float
    "Formatted string of the date, eg. '24/08/2021'"
    date: String
    "The time as a string like '2 days ago'"
    relativeTime: String
    "Number of lessons that the child has completed, or has stats recorded for"
    value: Int
  }

  type CourseActivityData {
    course: Course
    value: Int
  }
`;
