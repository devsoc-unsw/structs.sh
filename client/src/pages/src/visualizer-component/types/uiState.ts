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
  x: number;
  y: number;
};

export const DEFAULT_UISTATE: UiState = {
  showHover: false,
  showClick: true,
  canDrag: true,
  debug: true,
  clickedEntity: null,
  visualizerType: VisualizerType.BINARY_TREE,
  x: 800,
  y: 400
};

export const NODE_SIZE = 30;
export const EDGE_WIDTH = 6;
export const NODE_MIN_DISTANCE = 75;
