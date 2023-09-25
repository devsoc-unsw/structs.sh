import React from 'react';
import { GenericGraph } from '../types/frontendType';

export interface VisualizerState {
  graphState: GenericGraph;
  dimensions: {
    width: number;
    height: number;
  };
}

export type VisualizerComponent = React.FC<VisualizerState>;
