import { UseBoundStore, StoreApi, create } from 'zustand';
import { UserAnnotation } from './types/annotationType';
import { GlobalStateStore, DEFAULT_GLOBAL_STORE } from './types/globalState';
import { VisualizerType } from './types/visaulizerType';
import { visualizerFactory } from './visulizer/visualizerFactory';
import { parserFactory } from './parser/parserFactory';
import { BackendTypeDeclarations } from './types/backendType';

type GlobalStoreActions = {
  setVisualizerType: (type: VisualizerType) => void;
  updateDimensions: (width: number, height: number) => void;
  updateUserAnnotation: (annotation: UserAnnotation) => void;
  updateTypeDeclaration: (type: BackendTypeDeclarations) => void;
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
    updateTypeDeclaration: (type: BackendTypeDeclarations) => {
      set((state) => ({
        visualizer: {
          ...state.visualizer,
          typeDeclarations: [...state.visualizer.typeDeclaration, type],
        },
      }));
    },
  }));
