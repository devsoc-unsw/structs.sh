import { UseBoundStore, StoreApi, create } from 'zustand';
import { socket } from 'utils/socket';
import { Parser } from '../Component/Visualizer/parser/parser';
import { parserFactory } from '../Component/Visualizer/parser/parserFactory';
import { VisualizerComponent } from '../Component/Visualizer/visulizer/visualizer';
import { visualizerFactory } from '../Component/Visualizer/visulizer/visualizerFactory';
import { UserAnnotation } from '../Types/annotationType';
import { BackendState, BackendTypeDeclaration, INITIAL_BACKEND_STATE } from '../Types/backendType';
import { VisualizerType } from '../Types/visualizerType';
import * as InspectorDummy from './stackInpsectorDummyData.json';
import { GenericGraph, INITIAL_GRAPH } from '../Types/frontendType';

export type UiState = {
  width: number;
  height: number;
};

type VisualiserState = { backendState: BackendState; graphState: GenericGraph };

export type VisualizerParam = {
  visualizerType: VisualizerType;
  userAnnotation: UserAnnotation;
  visComponent: VisualizerComponent;
  parser: Parser;
  typeDeclarations: BackendTypeDeclaration[];
  stackInspector: any;
};

export type GlobalStateStore = {
  uiState: UiState;
  visualizer: VisualizerParam;
  currIdx: number;
  visualiserStates: VisualiserState[];
  currVisualiserState: () => VisualiserState;
  numStates: () => number;
};

export const DEFAULT_GLOBAL_STORE: GlobalStateStore = {
  uiState: {
    width: 800,
    height: 400,
  },
  visualizer: {
    visualizerType: VisualizerType.LINKED_LIST,
    userAnnotation: {
      stackAnnotation: {},
      typeAnnotation: {},
    },
    visComponent: visualizerFactory(VisualizerType.LINKED_LIST),
    parser: parserFactory(VisualizerType.LINKED_LIST),
    typeDeclarations: [],
    stackInspector: InspectorDummy,
  },
  currIdx: 0,
  visualiserStates: [],
  currVisualiserState: () => ({ backendState: INITIAL_BACKEND_STATE, graphState: INITIAL_GRAPH }),
  numStates: () => 0,
};

export const NODE_SIZE = 30;
export const EDGE_WIDTH = 6;
export const NODE_MIN_DISTANCE = 75;

type GlobalStoreActions = {
  setVisualizerType: (type: VisualizerType) => void;
  updateDimensions: (width: number, height: number) => void;
  updateUserAnnotation: (annotation: UserAnnotation) => void;
  updateTypeDeclaration: (type: BackendTypeDeclaration) => void;
  updateCurrState: (newCurrState: number) => void;
  appendNewState: (backendState: BackendState) => void;
  // updateNextState: (newState: GenericGraph) => void;
  forwardState: () => void;
  backwardState: () => void;
  clearTypeDeclarations: () => void;
  clearUserAnnotation: () => void;
  clearVisualiserStates: () => void;
};

export const useGlobalStore: UseBoundStore<StoreApi<GlobalStateStore & GlobalStoreActions>> =
  create<GlobalStateStore & GlobalStoreActions>((set) => ({
    ...DEFAULT_GLOBAL_STORE,
    currVisualiserState: () => {
      if (
        useGlobalStore.getState().currIdx < 0 ||
        useGlobalStore.getState().currIdx >= useGlobalStore.getState().visualiserStates.length
      ) {
        return { backendState: INITIAL_BACKEND_STATE, graphState: INITIAL_GRAPH };
      }
      return useGlobalStore.getState().visualiserStates[useGlobalStore.getState().currIdx];
    },
    numStates: () => {
      return useGlobalStore.getState().visualiserStates.length;
    },
    setVisualizerType: (type: VisualizerType) => {
      set((state) => ({
        visualizer: {
          ...state.visualizer,
          visualizerType: type,
          visComponent: visualizerFactory(type),
          parser: parserFactory(type),
        },
      }));
    },
    updateDimensions: (width: number, height: number) => {
      set({ uiState: { width, height } });
    },
    updateUserAnnotation: (annotation: UserAnnotation) => {
      set((state) => ({
        visualizer: {
          ...state.visualizer,
          userAnnotation: annotation,
        },
      }));
      console.log('userAnnotation', annotation);
    },
    updateTypeDeclaration: (type: BackendTypeDeclaration) => {
      set((state) => ({
        visualizer: {
          ...state.visualizer,
          typeDeclarations: [...state.visualizer.typeDeclarations, type],
        },
      }));
    },
    updateCurrState: (newCurrIdx: number) => {
      set((state) => {
        let currIdx = newCurrIdx;
        if (currIdx < 0) {
          currIdx = 0;
        } else if (currIdx >= state.visualiserStates.length) {
          currIdx = state.visualiserStates.length;
        }

        const newVisualiserStates = [...state.visualiserStates];

        // Update this graph state with latest user annotations
        if (currIdx < state.numStates() && state.visualizer.userAnnotation) {
          const newGraphState = state.visualizer.parser.parseState(
            state.visualiserStates[currIdx].backendState,
            state.visualizer.userAnnotation
          );
          const newVisualiserState = {
            backendState: state.visualiserStates[currIdx].backendState,
            graphState: newGraphState,
          };
          newVisualiserStates[currIdx] = newVisualiserState;
        }

        // If the user is at the end of the visualiserStates, buffer the next 6 states
        if (currIdx > state.visualiserStates.length - 8) {
          for (let i = 0; i < 16; i += 1) {
            setTimeout(() => socket.emit('executeNext'), i * 400);
          }
        }
        console.log(state.visualiserStates);
        return { currIdx, visualiserStates: newVisualiserStates };
      });
    },
    appendNewState: (newBackendState: BackendState) => {
      set((state) => {
        if (newBackendState && state.visualizer.userAnnotation) {
          const newGraphState = state.visualizer.parser.parseState(
            newBackendState,
            state.visualizer.userAnnotation
          );
          const newVisualiserState = {
            backendState: newBackendState,
            graphState: newGraphState,
          };
          return {
            visualiserStates: [...state.visualiserStates, newVisualiserState],
          };
        }

        let issue = 'something';
        if (!newBackendState) {
          issue = 'backendState';
        } else if (!state.visualizer.userAnnotation) {
          issue = 'localsAnnotations';
        }
        console.error(`Unable to parse backend state: ${issue} is undefined`);
        return {};
      });
    },
    // updateNextState: (newState: GenericGraph) => {
    //   set((state) => ({
    //     graphStates: [...state.graphStates, newState],
    //     currGraphStateIdx: state.currGraphStateIdx + 1,
    //   }));
    // },
    forwardState: () => {
      set((state) => {
        if (state.currIdx >= state.visualiserStates.length) {
          return { currIdx: state.visualiserStates.length };
        }
        return {
          currIdx: state.currIdx + 1,
        };
      });
    },
    backwardState: () => {
      set((state) => {
        if (state.currIdx <= 0) {
          return { currIdx: 0 };
        }
        return {
          currIdx: state.currIdx - 1,
        };
      });
    },
    clearTypeDeclarations: () => {
      set((state) => ({
        visualizer: {
          ...state.visualizer,
          typeDeclarations: [],
        },
      }));
    },
    clearUserAnnotation: () => {
      set((state) => ({
        visualizer: {
          ...state.visualizer,
          userAnnotation: {
            stackAnnotation: {},
            typeAnnotation: {},
          },
        },
      }));
    },
    clearVisualiserStates: () => {
      set({ visualiserStates: [] });
    },
  }));
