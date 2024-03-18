import { UserAnnotation } from '../../../Types/annotationType';
import { BackendState } from '../../../Types/backendType';
import { GenericGraph } from '../../../Types/frontendType';

export interface Parser {
  parseState: (backendStructure: BackendState, annotation: UserAnnotation) => GenericGraph;
}

/**
 * TODO: Implement
 */
export function parseUserDefinedDataStructure() {
  return undefined;
}
