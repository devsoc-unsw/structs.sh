import { UiState, VisualizerType } from '../types/uiState';
import { assertUnreachable } from '../util/util';
import LinkedList from './linkedListVisualizer';
import Array from './ArrayVisualizer';
import { VisualizerComponent } from './visualizer';

export function visualizerFactory(uiState: UiState): VisualizerComponent {
  switch (uiState.visualizerType) {
    case VisualizerType.LINKED_LIST: {
      return LinkedList;
    }
    case VisualizerType.BINARY_TREE:
    case VisualizerType.GRAPH:
    case VisualizerType.ARRAY: {
      return Array;
    }
    default:
      assertUnreachable(uiState.visualizerType);
  }
  return undefined;
}
