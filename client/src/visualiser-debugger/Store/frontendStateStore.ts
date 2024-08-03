import { UseBoundStore, StoreApi, create } from 'zustand';
import { GenericGraph, INITIAL_GRAPH } from '../Types/frontendType';

type State = {
  states: GenericGraph[];
  currStateIdx: number;
  activeSession: boolean;
  currState: () => GenericGraph;
};
type Action = {
  appendNewState: (newState: GenericGraph) => void;
  setNextState: () => void;
  setLastState: () => void;
  setActiveSession: (active: boolean) => void;
};

export const useFrontendStateStore: UseBoundStore<StoreApi<State & Action>> = create<
  State & Action
>((set) => ({
  states: [],
  currStateIdx: -1,
  activeSession: false,
  currState: () => {
    if (useFrontendStateStore.getState().currStateIdx === -1) {
      return INITIAL_GRAPH;
    }
    return useFrontendStateStore.getState().states[useFrontendStateStore.getState().currStateIdx];
  },
  appendNewState: (newState: GenericGraph) => {
    set((state) => ({
      states: [...state.states, newState],
    }));
  },
  setNextState: () => {
    if (
      useFrontendStateStore.getState().currStateIdx >=
      useFrontendStateStore.getState().states.length - 1
    ) {
      return;
    }
    set((state) => ({
      currStateIdx: state.currStateIdx + 1,
    }));
  },
  setLastState: () => {
    if (useFrontendStateStore.getState().currStateIdx <= 0) {
      return;
    }
    set((state) => ({
      currStateIdx: state.currStateIdx - 1,
    }));
  },
  setActiveSession: (active: boolean) => {
    set({ activeSession: active });
  },
}));
