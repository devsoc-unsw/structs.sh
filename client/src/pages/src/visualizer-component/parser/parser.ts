import { BackendState, BackendUpdate, EditorAnnotation } from '../types/backendType';
import { GenericGraph } from '../types/frontendType';

export interface Parser {
  parseInitialState: (
    backendStructure: BackendState,
    editorAnnotation: EditorAnnotation | undefined
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
