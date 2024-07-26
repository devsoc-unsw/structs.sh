import { VisualizerType } from '../../../Types/visualizerType';
import { assertUnreachable } from '../Util/util';
import { LinkedListParser } from './linkedListParser';
import { ArrayParser } from './arrayParser';
import { Parser } from './parser';

export function parserFactory(visualizerType: VisualizerType): Parser {
  switch (visualizerType) {
    case VisualizerType.LINKED_LIST: {
      return new LinkedListParser();
    }
    case VisualizerType.BINARY_TREE:
    case VisualizerType.GRAPH:
    case VisualizerType.ARRAY: {
      return new ArrayParser();
    }
    default:
      assertUnreachable(visualizerType);
  }
  return undefined;
}
