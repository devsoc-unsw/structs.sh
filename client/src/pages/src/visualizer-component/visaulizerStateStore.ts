import React from 'react';
import { StoreApi, UseBoundStore, create } from 'zustand';
import { GlobalStateStore } from './types/globalState';
import './css/stateManager.css';
import { GenericGraph, INITIAL_GRAPH } from './types/frontendType';
import { VisualizerComponent } from './visulizer/visualizer';

type State = {
  states: GenericGraph[];
  currStateIdx: number;
  currState: () => GenericGraph;
};
type Action = {
  updateNextState: (newState: GenericGraph) => void;
  forwardState: () => void;
  backwardState: () => void;
};

export const useFrontendStateStore: UseBoundStore<StoreApi<State & Action>> = create<
  State & Action
>((set) => ({
  states: [],
  currStateIdx: -1,
  currState: () => {
    if (useFrontendStateStore.getState().currStateIdx === -1) {
      return INITIAL_GRAPH;
    }
    return useFrontendStateStore.getState().states[useFrontendStateStore.getState().currStateIdx];
  },
  updateNextState: (newState: GenericGraph) => {
    set((state) => ({
      states: [...state.states, newState],
      currStateIdx: state.currStateIdx + 1,
    }));
  },
  forwardState: () => {
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
  backwardState: () => {
    if (useFrontendStateStore.getState().currStateIdx <= 0) {
      return;
    }
    set((state) => ({
      currStateIdx: state.currStateIdx - 1,
    }));
  },
}));

export interface StateManagerProp {
  state: GenericGraph;
  settings: GlobalStateStore;
  setSettings: React.Dispatch<React.SetStateAction<GlobalStateStore>>;
  nextState: () => void;

  Visualizer: VisualizerComponent;
}
