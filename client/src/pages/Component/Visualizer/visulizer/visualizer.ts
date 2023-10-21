import React from 'react';
import { GenericGraph } from '../../../Types/frontendType';

export interface VisualizerState {
  graphState: GenericGraph;
  dimension: {
    width: number;
    height: number;
  };
}

export type VisualizerComponent = React.FC<VisualizerState>;
