import gql from 'graphql-tag';
import { adminMutationsDef } from './admin';
import { componentMutationsDef } from './content/component';
import { courseMutationsDef } from './content/course';
import { lessonMutationsDef } from './content/lesson';
import { questionMutationsDef } from './content/question';
import { lessonStatisticsMutationsDef } from './statistics/lessonStatistics';
import { sessionMutationsDef } from './session/session';
import { userMutationsDef } from './user';

/**
 * Just placing one mutation in the initialisation here
 * so that we don't get an empty type error. The rest
 * of the ${mutationDef}s below it, extend the Mutation
 * type
 */
export const mutationsDef = gql`
  "All mutations for the GalacticEd database."
  type Mutation {
    "Add a new user to GalacticEd"
    createUser(user: CreateUserInput): String
  }

  ${userMutationsDef}
  ${adminMutationsDef}
  ${lessonStatisticsMutationsDef}
  ${courseMutationsDef}
  ${lessonMutationsDef}
  ${questionMutationsDef}
  ${sessionMutationsDef}
`;

// ${componentMutationsDef}
