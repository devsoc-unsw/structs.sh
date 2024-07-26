import { VisualizerType } from '../../../Types/visualizerType';
import { assertUnreachable } from '../Util/util';
import LinkedList from './linkedListVisualizer';
import Array from './arrayVisualizer';
import { VisualizerComponent } from './visualizer';

export function visualizerFactory(visualizerType: VisualizerType): VisualizerComponent {
  switch (visualizerType) {
    case VisualizerType.LINKED_LIST: {
      return LinkedList;
    }
    case VisualizerType.BINARY_TREE:
    case VisualizerType.GRAPH:
    case VisualizerType.ARRAY: {
      return Array;
    }
    default:
      assertUnreachable(visualizerType);
  }
  return undefined;
}
