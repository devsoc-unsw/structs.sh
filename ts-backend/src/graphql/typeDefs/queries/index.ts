import gql from 'graphql-tag';
import { adminQueriesDef } from './admin';
import { componentQueriesDef } from './content/component';
import { courseQueriesDef } from './content/course';
import { lessonQueriesDef } from './content/lesson';
import { questionQueriesDef } from './content/question';
import { lessonStatisticsQueriesDef } from './statistics/lessonStatistics';
import { sessionQueriesDef } from './session/session';
import { dataVisualisationQueriesDef } from './statistics/dataVisualisation';
import { userQueriesDef } from './user';
import { builderQueriesDef } from './builder/image';

export const queriesDef = gql`
  "All queries to the GalacticEd database."
  type Query {
    "Get all users currently in GalacticEd"
    getAllUsers: [User]
  }

  ${userQueriesDef}
  ${adminQueriesDef}
  ${courseQueriesDef}
  ${lessonQueriesDef}
  ${questionQueriesDef}
  ${componentQueriesDef}
  ${lessonStatisticsQueriesDef}
  ${sessionQueriesDef}
  ${dataVisualisationQueriesDef}
  ${builderQueriesDef}
`;
