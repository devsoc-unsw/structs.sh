import { gql } from 'graphql-tag';
import { ticketTypeDefs } from './domains/admin';
import { userTypeDefs } from './domains/user';
import { lessonStatisticsTypeDefs } from './domains/statistics/lessonStatistics';
import { sessionTypeDefs } from './domains/session/session';
import { courseTypeDefs } from './domains/content/course';
import { lessonTypeDefs } from './domains/content/lesson';
import { questionTypeDefs } from './domains/content/question';
import { componentTypeDefs } from './domains/content/component';
import { dataVisualisationTypeDefs } from './domains/statistics/dataVisualisation';
import { builderTypeDefs } from './domains/builder/image';
import { queriesDef } from './queries';
import { mutationsDef } from './mutations';

export const typeDefs = gql`
  ${userTypeDefs}
  ${ticketTypeDefs}
  ${courseTypeDefs}
  ${lessonTypeDefs}
  ${questionTypeDefs}
  ${componentTypeDefs}
  ${lessonStatisticsTypeDefs}
  ${sessionTypeDefs}
  ${dataVisualisationTypeDefs}
  ${builderTypeDefs}

  ${queriesDef}
  ${mutationsDef}
`;
