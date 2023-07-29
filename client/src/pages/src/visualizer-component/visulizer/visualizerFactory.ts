import { UiState, VisualizerType } from "../types/uiState";
import { assertUnreachable } from "../util/util";
import LinkedList from "./linkedList";
import { VisualizerComponent } from "./visualizer";

export function visualizerFactory(uiState: UiState): VisualizerComponent {
  switch (uiState.visualizerType) {
    case VisualizerType.LINKED_LIST: {
      return LinkedList;
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