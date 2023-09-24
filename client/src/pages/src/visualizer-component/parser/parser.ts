import {
  DataStructureAnnotation,
  LinkedListAnnotation,
  LocalsAnnotations,
} from '../types/annotationType';
import { BackendState } from '../types/backendType';
import { GenericGraph } from '../types/frontendType';
import { UiState } from '../types/uiState';

export interface Parser {
  parseInitialState: (
    backendStructure: BackendState,
    localsAnnotations: LocalsAnnotations | undefined,
    dataStructureAnnotation: DataStructureAnnotation | undefined,
    uiState: UiState
  ) => GenericGraph;
  updateState: (
    frontendStructure: GenericGraph,
    backendStructure: BackendState,
    dataStructureAnnotation: DataStructureAnnotation,
    linkedListAnnotation: LinkedListAnnotation
  ) => GenericGraph;
}

/**
 * TODO: Implement
 */
export function parseUserDefinedDataStructure() {
  return undefined;
}
