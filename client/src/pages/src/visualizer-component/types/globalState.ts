import { UserAnnotation } from './annotationType';
import { VisualizerComponent } from '../visulizer/visualizer';
import { Parser } from '../parser/parser';
import { VisualizerType } from './visualizerType';
import { visualizerFactory } from '../visulizer/visualizerFactory';
import { parserFactory } from '../parser/parserFactory';
import { BackendTypeDeclaration } from './backendType';

export type UiState = {
  width: number;
  height: number;
};

export type VisualizerParam = {
  visualizerType: VisualizerType;
  userAnnotation: UserAnnotation;
  visComponent: VisualizerComponent;
  parser: Parser;
  typeDeclarations: BackendTypeDeclaration[];
};

export type GlobalStateStore = {
  uiState: UiState;
  visualizer: VisualizerParam;
};

export const DEFAULT_GLOBAL_STORE: GlobalStateStore = {
  uiState: {
    width: 800,
    height: 400,
  },
  visualizer: {
    visualizerType: VisualizerType.LINKED_LIST,
    userAnnotation: {
      stackAnnotation: {},
      typeAnnotation: {},
    },
    visComponent: visualizerFactory(VisualizerType.LINKED_LIST),
    parser: parserFactory(VisualizerType.LINKED_LIST),
    typeDeclarations: [],
  },
};

export const NODE_SIZE = 30;
export const EDGE_WIDTH = 6;
export const NODE_MIN_DISTANCE = 75;
