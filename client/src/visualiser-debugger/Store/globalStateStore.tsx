import { UseBoundStore, StoreApi, create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Parser } from '../Component/Visualizer/Parser/parser';
import { parserFactory } from '../Component/Visualizer/Parser/parserFactory';
import { VisualizerComponent } from '../Component/Visualizer/Visulizer/visualizer';
import { visualizerFactory } from '../Component/Visualizer/Visulizer/visualizerFactory';
import { StackAnnotation, UserAnnotation } from '../Types/annotationType';
import { BackendState, BackendTypeDeclaration, INITIAL_BACKEND_STATE } from '../Types/backendType';
import { VisualizerType } from '../Types/visualizerType';

export type UiState = {
  visualizerDimension: {
    width: number;
    height: number;
  };
  currFocusedTab: string;
};

export type VisualizerParam = {
  visualizerType: VisualizerType;
  userAnnotation: UserAnnotation;
  visComponent: VisualizerComponent;
  parser: Parser;
  typeDeclarations: BackendTypeDeclaration[];
};

export type GlobalStateStore = {
  uiState: UiState;
  visualizer: VisualizerParam;
  // Refactor to include backend data history
  currFrame: BackendState;
  consoleChunks: string[];
};

export const DEFAULT_GLOBAL_STORE: GlobalStateStore = {
  uiState: {
    visualizerDimension: {
      width: 800,
      height: 400,
    },
    currFocusedTab: '0',
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
  },
  currFrame: INITIAL_BACKEND_STATE,
  consoleChunks: [],
};

export const NODE_SIZE = 30;
export const EDGE_WIDTH = 6;
export const NODE_MIN_DISTANCE = 75;

type GlobalStoreActions = {
  setVisualizerType: (type: VisualizerType) => void;
  updateDimensions: (width: number, height: number) => void;
  updateCurrFocusedTab: (tab: string) => void;
  updateUserAnnotation: (annotation: UserAnnotation) => void;
  updateStackAnnotation: (annotation: StackAnnotation) => void;
  updateTypeDeclaration: (type: BackendTypeDeclaration) => void;
  updateNextFrame: (backendState: BackendState) => void;
  clearTypeDeclarations: () => void;
  clearUserAnnotation: () => void;
  appendConsoleChunks: (chunk: string | string[]) => void;
  resetConsoleChunks: () => void;
};

export const useGlobalStore: UseBoundStore<StoreApi<GlobalStateStore & GlobalStoreActions>> =
  create<GlobalStateStore & GlobalStoreActions>()(
    devtools((set) => ({
      ...DEFAULT_GLOBAL_STORE,
      setVisualizerType: (type: VisualizerType) => {
        set(
          (state) => ({
            visualizer: {
              ...state.visualizer,
              visualizerType: type,
              visComponent: visualizerFactory(type),
              parser: parserFactory(type),
            },
          }),
          false,
          'setVisualizerType'
        );
      },
      updateDimensions: (width: number, height: number) => {
        set((state) => ({
          ...state,
          uiState: {
            visualizerDimension: { width, height },
            currFocusedTab: state.uiState.currFocusedTab,
          },
        }));
      },
      updateCurrFocusedTab: (tab: string) => {
        set((state) => ({
          ...state,
          uiState: {
            visualizerDimension: state.uiState.visualizerDimension,
            currFocusedTab: tab,
          },
        }));
      },
      updateUserAnnotation: (annotation: UserAnnotation) => {
        set(
          (state) => ({
            visualizer: {
              ...state.visualizer,
              userAnnotation: annotation,
            },
          }),
          false,
          'updateUserAnnotation'
        );
      },
      // A separate reducer for updating stack annotation.
      // Using updateUserAnnotation and using userAnnotation state
      // doesn't correctly update the state if used in useEffect for multiple children components
      // because the value from the "set" callback is more recent
      updateStackAnnotation: (stackAnnotation) => {
        set(
          (state) => ({
            visualizer: {
              ...state.visualizer,
              userAnnotation: {
                ...state.visualizer.userAnnotation,
                stackAnnotation: {
                  ...state.visualizer.userAnnotation.stackAnnotation,
                  ...stackAnnotation,
                },
              },
            },
          }),
          false,
          'updateStackAnnotation'
        );
      },
      updateTypeDeclaration: (type: BackendTypeDeclaration) => {
        set(
          (state) => ({
            visualizer: {
              ...state.visualizer,
              typeDeclarations: [...state.visualizer.typeDeclarations, type],
            },
          }),
          false,
          'updateTypeDeclaration'
        );
      },
      updateNextFrame: (backendState: BackendState) => {
        set({ currFrame: backendState }, false, 'updateNextFrame');
      },
      clearTypeDeclarations: () => {
        set(
          (state) => ({
            visualizer: {
              ...state.visualizer,
              typeDeclarations: [],
            },
          }),
          false,
          'clearTypeDeclarations'
        );
      },
      clearUserAnnotation: () => {
        set(
          (state) => ({
            visualizer: {
              ...state.visualizer,
              userAnnotation: {
                stackAnnotation: {},
                typeAnnotation: {},
              },
            },
          }),
          false,
          'clearUserAnnotation'
        );
      },
      appendConsoleChunks: (chunk: string | string[]) => {
        if (Array.isArray(chunk)) {
          set((state) => ({ consoleChunks: [...state.consoleChunks, ...chunk] }));
        } else {
          set((state) => ({ consoleChunks: [...state.consoleChunks, chunk] }));
        }
      },
      setConsoleChunks: (chunk: string[]) => {
        set(() => ({ consoleChunks: chunk }));
      },
      resetConsoleChunks: () => {
        set(() => ({ consoleChunks: [] }));
      },
    }))
  );
