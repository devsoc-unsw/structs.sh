import { UserAnnotation } from '../types/annotationType';
import { BackendState } from '../types/backendType';
import { GenericGraph } from '../types/frontendType';

export interface Parser {
  parseInitialState: (backendStructure: BackendState, annotation: UserAnnotation) => GenericGraph;
}

/**
 * TODO: Implement
 */
export function parseUserDefinedDataStructure() {
  return undefined;
}
