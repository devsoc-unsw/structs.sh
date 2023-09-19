import { BackendState, BackendUpdate, EditorAnnotation } from '../types/backendType';
import { GenericGraph } from '../types/frontendType';
import { UiState } from '../types/uiState';

export interface Parser {
  parseInitialState: (
    backendStructure: BackendState,
    editorAnnotation: EditorAnnotation | undefined,
    uiState: UiState
  ) => GenericGraph;
  updateState: (
    frontendStructure: GenericGraph,
    backendStructure: BackendState,
    backendUpdate: BackendUpdate,
    editorAnnotation: EditorAnnotation | undefined
  ) => GenericGraph;
}

/**
 * TODO: Implement
 */
export function parseUserDefinedDataStructure() {
  return undefined;
}
