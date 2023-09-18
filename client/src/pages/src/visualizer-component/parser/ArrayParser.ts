import { Addr, BackendState, EditorAnnotation, BackendUpdate } from '../types/backendType';
import { FrontendLinkedListGraph, GenericGraph } from '../types/frontendType';
import { Parser } from './parser';

export class ArrayParser implements Parser {
  /**
   * Parser functionality
   */
  parseInitialState(
    backendStructure: BackendState,
    editorAnnotation: EditorAnnotation
  ): BackendState {
    console.log('backendStructure', backendStructure);
    return backendStructure;
  }

  updateState(
    frontendStructure: GenericGraph,
    backendStructure: BackendState,
    backendUpdate: BackendUpdate,
    editorAnnotation: EditorAnnotation
  ) {
    return undefined;
  }
}
