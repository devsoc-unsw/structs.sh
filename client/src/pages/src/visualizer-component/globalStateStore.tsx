import { UseBoundStore, StoreApi, create } from 'zustand';
import { UserAnnotation } from './types/annotationType';
import { GlobalStateStore, DEFAULT_GLOBAL_STORE } from './types/globalState';
import { VisualizerType } from './types/visaulizerType';
import { visualizerFactory } from './visulizer/visualizerFactory';
import { parserFactory } from './parser/parserFactory';

type GlobalStoreActions = {
  setVisualizerType: (type: VisualizerType) => void;
  updateDimensions: (width: number, height: number) => void;
  updateUserAnnotation: (annotation: UserAnnotation) => void;
};

export const useGlobalStore: UseBoundStore<StoreApi<GlobalStateStore & GlobalStoreActions>> =
  create<GlobalStateStore & GlobalStoreActions>((set) => ({
    ...DEFAULT_GLOBAL_STORE,
    setVisualizerType: (type: VisualizerType) => {
      set({
        visualizerType: type,
        visComponent: visualizerFactory(type),
        parser: parserFactory(type),
      });
    },
    updateDimensions: (width: number, height: number) => {
      set({ width, height });
    },
    updateUserAnnotation: (annotation: UserAnnotation) => {
      set({ userAnnotation: annotation });
    },
  }));
