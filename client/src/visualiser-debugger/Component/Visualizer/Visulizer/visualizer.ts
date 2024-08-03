import React from 'react';
import { FrontendState } from '../../../Types/frontendType';

export interface VisualizerState {
  graphState: FrontendState;
  dimension: {
    width: number;
    height: number;
  };
}

export type VisualizerComponent = React.FC<VisualizerState>;
