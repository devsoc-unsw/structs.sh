import { BackendState, BackendUpdate, EditorAnnotation, GenericGraph } from '../types/graphState';

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
