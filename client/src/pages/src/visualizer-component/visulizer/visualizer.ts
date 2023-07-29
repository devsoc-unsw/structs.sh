/**
 * This class manages the conversion from Backend 
 */

import React from "react";
import { GenericGraph } from "../types/graphState";
import { UiState } from "../types/uiState";

export interface VisualizerState {
  graphState: GenericGraph;
  settings: UiState;
  setSettings: React.Dispatch<React.SetStateAction<UiState>>;
}

export type VisualizerComponent = React.FC<VisualizerState>;