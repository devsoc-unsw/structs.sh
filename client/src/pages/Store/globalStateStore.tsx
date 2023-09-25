import { UseBoundStore, StoreApi, create } from 'zustand';
import { Parser } from '../Component/Visualizer/parser/parser';
import { parserFactory } from '../Component/Visualizer/parser/parserFactory';
import { VisualizerComponent } from '../Component/Visualizer/visulizer/visualizer';
import { visualizerFactory } from '../Component/Visualizer/visulizer/visualizerFactory';
import { UserAnnotation } from '../Types/annotationType';
import { BackendTypeDeclaration } from '../Types/backendType';
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
};

export const NODE_SIZE = 30;
export const EDGE_WIDTH = 6;
export const NODE_MIN_DISTANCE = 75;

type GlobalStoreActions = {
  setVisualizerType: (type: VisualizerType) => void;
  updateDimensions: (width: number, height: number) => void;
  updateUserAnnotation: (annotation: UserAnnotation) => void;
  updateTypeDeclaration: (type: BackendTypeDeclaration) => void;
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
