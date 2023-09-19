import { UiState, VisualizerType } from '../types/uiState';
import { assertUnreachable } from '../util/util';
import LinkedList from './linkedListVisualizer';
import { VisualizerComponent } from './visualizer';

export function visualizerFactory(uiState: UiState): VisualizerComponent {
  switch (uiState.visualizerType) {
    case VisualizerType.LINKED_LIST:
    case VisualizerType.BINARY_TREE: {
      return LinkedList;
    }
    case VisualizerType.GRAPH:
    case VisualizerType.ARRAY: {
      throw new Error('Not implemented');
    }
    default:
      assertUnreachable(uiState.visualizerType);
  }
  return undefined;
}
