import { VisualizerType } from '../types/visualizerType';
import { assertUnreachable } from '../util/util';
import LinkedList from './linkedListVisualizer';
import { VisualizerComponent } from './visualizer';

export function visualizerFactory(visualizerType: VisualizerType): VisualizerComponent {
  switch (visualizerType) {
    case VisualizerType.LINKED_LIST:
    case VisualizerType.BINARY_TREE: {
      return LinkedList;
    }
    case VisualizerType.GRAPH:
    case VisualizerType.ARRAY: {
      throw new Error('Not implemented');
    }
    default:
      assertUnreachable(visualizerType);
  }
  return undefined;
}
