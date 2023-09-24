import { UserAnnotation } from './annotationType';
import { VisualizerComponent } from '../visulizer/visualizer';
import { Parser } from '../parser/parser';
import { VisualizerType } from './visaulizerType';
import { visualizerFactory } from '../visulizer/visualizerFactory';
import { parserFactory } from '../parser/parserFactory';

export type UiState = {
  visualizerType: VisualizerType;
  width: number;
  height: number;
  userAnnotation: UserAnnotation;
  visComponent: VisualizerComponent;
  parser: Parser;
};

export const DEFAULT_UISTATE: UiState = {
  visualizerType: VisualizerType.LINKED_LIST,
  width: 800,
  height: 400,
  userAnnotation: {
    stackAnnotation: {},
    typeAnnotation: {},
  },
  visComponent: visualizerFactory(VisualizerType.LINKED_LIST),
  parser: parserFactory(VisualizerType.LINKED_LIST),
};

export const NODE_SIZE = 30;
export const EDGE_WIDTH = 6;
export const NODE_MIN_DISTANCE = 75;
