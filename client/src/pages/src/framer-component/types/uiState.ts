export enum VisualizerType {
  LINKED_LIST = 'LINKED_LIST',
  BINARY_TREE = 'BINARY_TREE',
  GRAPH = 'GRAPH',
  ARRAY = 'ARRAY',
}

export type UiState = {
  showHover: boolean;
  showClick: boolean;
  canDrag: boolean;
  debug: boolean;
  clickedEntity: string | null;
  visualizerType: VisualizerType;
}

export const DEFAULT_UISTATE: UiState = {
  showHover: false,
  showClick: true,
  canDrag: true,
  debug: true,
  clickedEntity: null,
  visualizerType: VisualizerType.LINKED_LIST,
}