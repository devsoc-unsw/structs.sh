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
  ) => GenericGraph | undefined;
  updateState: (
    frontendStructure: GenericGraph,
    backendStructure: BackendStructure,
    backendUpdate: BackendUpdate,
    editorAnnotation: EditorAnnotation
  ) => GenericGraph;
}
