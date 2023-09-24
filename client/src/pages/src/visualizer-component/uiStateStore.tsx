import { UseBoundStore, StoreApi, create } from 'zustand';
import { UserAnnotation } from './types/annotationType';
import { UiState, DEFAULT_UISTATE } from './types/uiState';
import { VisualizerType } from './types/visaulizerType';
import { visualizerFactory } from './visulizer/visualizerFactory';
import { parserFactory } from './parser/parserFactory';

type UiStateActions = {
  setVisualizerType: (type: VisualizerType) => void;
  updateDimensions: (width: number, height: number) => void;
  updateUserAnnotation: (annotation: UserAnnotation) => void;
};

export const useUiStateStore: UseBoundStore<StoreApi<UiState & UiStateActions>> = create<
  UiState & UiStateActions
>((set) => ({
  ...DEFAULT_UISTATE,
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
