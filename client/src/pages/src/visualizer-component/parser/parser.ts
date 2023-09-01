import {
  BackendStructure,
  BackendUpdate,
  EditorAnnotation,
  GenericGraph,
} from '../types/graphState';

export interface Parser {
  parseInitialState: (
    backendStructure: BackendStructure,
    editorAnnotation: EditorAnnotation | undefined
  ) => GenericGraph;
  updateState: (
    frontendStructure: GenericGraph,
    backendStructure: BackendStructure,
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