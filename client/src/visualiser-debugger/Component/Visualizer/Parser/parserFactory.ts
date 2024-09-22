import { VisualizerType } from '../../../Types/visualizerType';
// import { assertUnreachable } from '../Util/util';
import { LinkedListParser } from './linkedListParser';
import { Parser } from './parser';

export function parserFactory(visualizerType: VisualizerType): Parser {
  switch (visualizerType) {
    case VisualizerType.LINKED_LIST: {
      return new LinkedListParser();
    }
    case VisualizerType.BINARY_TREE:
    case VisualizerType.GRAPH:
    case VisualizerType.ARRAY: {
      throw new Error('Not implemented');
    }
    default:
      throw new Error('Visualizer Type not recognized');
    // default:
    //   assertUnreachable(visualizerType);
  }
  // return undefined;
}
