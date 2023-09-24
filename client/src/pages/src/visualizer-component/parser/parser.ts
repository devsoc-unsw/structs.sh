import { UserAnnotation } from '../types/annotationType';
import { BackendState } from '../types/backendType';
import { GenericGraph } from '../types/frontendType';
import { UiState } from '../types/uiState';

export interface Parser {
  parseInitialState: (
    backendStructure: BackendState,
    annotation: UserAnnotation,
    uiState: UiState
  ) => GenericGraph;
}

/**
 * TODO: Implement
 */
export function parseUserDefinedDataStructure() {
  return undefined;
}
