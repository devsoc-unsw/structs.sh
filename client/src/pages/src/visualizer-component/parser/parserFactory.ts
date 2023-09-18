import { UiState, VisualizerType } from '../types/uiState';
import { assertUnreachable } from '../util/util';
import { LinkedListParser } from './linkedListParser';
import { ArrayParser } from './ArrayParser';
import { Parser } from './parser';

export function parserFactory(uiState: UiState): Parser {
  switch (uiState.visualizerType) {
    case VisualizerType.LINKED_LIST: {
      return new LinkedListParser();
    }
    case VisualizerType.BINARY_TREE:
    case VisualizerType.GRAPH:
    case VisualizerType.ARRAY: {
      return new ArrayParser();
    }
    default:
      assertUnreachable(uiState.visualizerType);
  }
  return undefined;
}
