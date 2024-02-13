import { UseBoundStore, StoreApi, create } from 'zustand';
import { GenericGraph, INITIAL_GRAPH } from '../Types/frontendType';

type State = {
  graphStates: GenericGraph[];
  currGraphStateIdx: number;
  currGraphState: () => GenericGraph;
};
type Action = {
  updateNextState: (newState: GenericGraph) => void;
  forwardState: () => void;
  backwardState: () => void;
};

export const useFrontendStateStore: UseBoundStore<StoreApi<State & Action>> = create<
  State & Action
>((set) => ({
  graphStates: [],
  currGraphStateIdx: -1,
  currGraphState: () => {
    if (useFrontendStateStore.getState().currGraphStateIdx === -1) {
      return INITIAL_GRAPH;
    }
    return useFrontendStateStore.getState().graphStates[
      useFrontendStateStore.getState().currGraphStateIdx
    ];
  },
  updateNextState: (newState: GenericGraph) => {
    set((state) => ({
      graphStates: [...state.graphStates, newState],
      currGraphStateIdx: state.currGraphStateIdx + 1,
    }));
  },
  forwardState: () => {
    if (
      useFrontendStateStore.getState().currGraphStateIdx >=
      useFrontendStateStore.getState().graphStates.length - 1
    ) {
      return;
    }
    set((state) => ({
      currGraphStateIdx: state.currGraphStateIdx + 1,
    }));
  },
  backwardState: () => {
    if (useFrontendStateStore.getState().currGraphStateIdx <= 0) {
      return;
    }
    set((state) => ({
      currGraphStateIdx: state.currGraphStateIdx - 1,
    }));
  },
}));

// export interface StateManagerProp {
//   state: GenericGraph;
//   settings: GlobalStateStore;
//   setSettings: React.Dispatch<React.SetStateAction<GlobalStateStore>>;
//   nextState: () => void;

//   Visualizer: VisualizerComponent;
// }
