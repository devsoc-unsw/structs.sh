/**
 * This class manages the conversion from Backend
 */

import React from 'react';
import { GenericGraph } from '../types/frontendType';
import { UiState } from '../types/uiState';

export interface VisualizerState {
  graphState: GenericGraph;
  settings: UiState;
  setSettings: React.Dispatch<React.SetStateAction<UiState>>;
  dimensions: {
    width: number;
    height: number;
  };
}

export type VisualizerComponent = React.FC<VisualizerState>;
