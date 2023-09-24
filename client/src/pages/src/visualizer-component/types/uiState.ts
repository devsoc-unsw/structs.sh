import { create } from 'zustand';
import { UserAnnotation } from './annotationType';

export enum VisualizerType {
  LINKED_LIST = 'LINKED_LIST',
  BINARY_TREE = 'BINARY_TREE',
  GRAPH = 'GRAPH',
  ARRAY = 'ARRAY',
}

export type UiState = {
  visualizerType: VisualizerType;
  width: number;
  height: number;
  userAnnotation: UserAnnotation;
};

export const DEFAULT_UISTATE: UiState = {
  visualizerType: VisualizerType.LINKED_LIST,
  width: 800,
  height: 400,
  userAnnotation: {
    stackAnnotation: {},
    typeAnnotation: {},
  },
};

export const NODE_SIZE = 30;
export const EDGE_WIDTH = 6;
export const NODE_MIN_DISTANCE = 75;
