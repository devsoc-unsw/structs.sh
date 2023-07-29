import {
  BackendStructure,
  BackendUpdate,
  EditorAnnotation,
  GenericGraph,
} from '../types/graphState';

export interface Parser {
  parseInitialState: (
    backendStructure: BackendStructure,
    editorAnnotation: EditorAnnotation
  ) => GenericGraph;
  updateState: (
    frontendStructure: GenericGraph,
    backendStructure: BackendStructure,
    backendUpdate: BackendUpdate,
    editorAnnotation: EditorAnnotation
  ) => GenericGraph;
}

/**
 * TODO: Implement
 */
export function parseUserDefinedDataStructure() {
  return undefined;
}