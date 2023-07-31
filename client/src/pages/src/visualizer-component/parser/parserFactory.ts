import { UiState, VisualizerType } from '../types/uiState';
import { assertUnreachable } from '../util/util';
import { LinkedListParser } from './linkedListParser';
import { Parser } from './parser';

export function parserFactory(uiState: UiState): Parser {
  switch (uiState.visualizerType) {
    case VisualizerType.LINKED_LIST: {
      return new LinkedListParser();
    }
    case VisualizerType.BINARY_TREE:
    case VisualizerType.GRAPH:
    case VisualizerType.ARRAY: {
      throw new Error('Not implemented');
    }
    default:
      assertUnreachable(uiState.visualizerType);
  }
  return undefined;
}
