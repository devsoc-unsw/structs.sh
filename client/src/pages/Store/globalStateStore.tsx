import { UseBoundStore, StoreApi, create } from 'zustand';
import { Parser } from '../Component/Visualizer/Parser/parser';
import { parserFactory } from '../Component/Visualizer/Parser/parserFactory';
import { VisualizerComponent } from '../Component/Visualizer/Visulizer/visualizer';
import { visualizerFactory } from '../Component/Visualizer/Visulizer/visualizerFactory';
import { UserAnnotation } from '../Types/annotationType';
import { BackendState, BackendTypeDeclaration, INITIAL_BACKEND_STATE } from '../Types/backendType';
import { VisualizerType } from '../Types/visualizerType';
import * as InspectorDummy from './stackInpsectorDummyData.json';

export type UiState = {
  width: number;
  height: number;
};

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
  // Refactor to include backend data history
  currFrame: BackendState;
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
  currFrame: INITIAL_BACKEND_STATE,
};

export const NODE_SIZE = 30;
export const EDGE_WIDTH = 6;
export const NODE_MIN_DISTANCE = 75;

type GlobalStoreActions = {
  setVisualizerType: (type: VisualizerType) => void;
  updateDimensions: (width: number, height: number) => void;
  updateUserAnnotation: (annotation: UserAnnotation) => void;
  updateTypeDeclaration: (type: BackendTypeDeclaration) => void;
  updateNextFrame: (backendState: BackendState) => void;
  clearTypeDeclarations: () => void;
  clearUserAnnotation: () => void;
};

export const useGlobalStore: UseBoundStore<StoreApi<GlobalStateStore & GlobalStoreActions>> =
  create<GlobalStateStore & GlobalStoreActions>((set) => ({
    ...DEFAULT_GLOBAL_STORE,
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
    },
    updateTypeDeclaration: (type: BackendTypeDeclaration) => {
      set((state) => ({
        visualizer: {
          ...state.visualizer,
          typeDeclarations: [...state.visualizer.typeDeclarations, type],
        },
      }));
    },
    updateNextFrame: (backendState: BackendState) => {
      set({ currFrame: backendState });
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
  }));
