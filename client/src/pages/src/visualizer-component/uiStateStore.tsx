import { UseBoundStore, StoreApi, create } from 'zustand';
import { UserAnnotation } from './types/annotationType';
import { VisualizerType, UiState, DEFAULT_UISTATE } from './types/uiState';

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
    set({ visualizerType: type });
  },
  updateDimensions: (width: number, height: number) => {
    set({ width, height });
  },
  updateUserAnnotation: (annotation: UserAnnotation) => {
    set({ userAnnotation: annotation });
  },
}));
