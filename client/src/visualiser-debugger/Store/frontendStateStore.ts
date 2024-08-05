import { UseBoundStore, StoreApi, create } from 'zustand';
import { FrontendState, INITIAL_GRAPH } from '../Types/frontendType';
import { BackendState, INITIAL_BACKEND_STATE } from '../Types/backendType';

// Map BackendState and FrontendState one to one?? Good design??
type MappedState = {
  backendState: BackendState;
  frontendState: FrontendState;
};

type State = {
  states: MappedState[];
  currentIndex: number;
  isActive: boolean;
  currState: () => MappedState;
};

type Action = {
  appendFrontendNewState: (backendState: BackendState, newState: FrontendState) => void;
  stepForward: () => void;
  stepBackward: () => void;
  jumpToState: (index: number) => void;
  setActive: (active: boolean) => void;
  clearFrontendState: () => void;
};

export const useFrontendStateStore: UseBoundStore<StoreApi<State & Action>> = create<
  State & Action
>((set) => ({
  states: [],
  currentIndex: -1,
  isActive: false,
  currState: () => {
    if (useFrontendStateStore.getState().currentIndex === -1) {
      return {
        backendState: INITIAL_BACKEND_STATE,
        frontendState: INITIAL_GRAPH,
      };
    }
    return useFrontendStateStore.getState().states[useFrontendStateStore.getState().currentIndex];
  },
  appendFrontendNewState: (backendState: BackendState, newState: FrontendState) => {
    set((state) => ({
      states: [
        ...state.states,
        {
          backendState,
          frontendState: newState,
        },
      ],
    }));
  },
  stepForward: () => {
    if (
      useFrontendStateStore.getState().currentIndex >=
      useFrontendStateStore.getState().states.length - 1
    ) {
      return;
    }
    set((state) => ({
      currentIndex: state.currentIndex + 1,
    }));
  },
  stepBackward: () => {
    if (useFrontendStateStore.getState().currentIndex <= 0) {
      return;
    }
    set((state) => ({
      currentIndex: state.currentIndex - 1,
    }));
  },
  jumpToState: (index: number) => {
    if (index < 0 || index >= useFrontendStateStore.getState().states.length) {
      return;
    }
    set({ currentIndex: index });
  },
  setActive: (active: boolean) => {
    set({ isActive: active });
  },
  clearFrontendState: () => {
    set({ isActive: false, states: [], currentIndex: -1 });
  },
}));
