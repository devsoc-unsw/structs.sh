import React from 'react';
import { GenericGraph } from '../../../Types/frontendType';

export interface VisualizerState {
  graphState: GenericGraph;
  dimension: {
    width: number;
    height: number;
  };
}

/* export function setCenteredPosition(graph: GenericGraph, svg: SVGSVGElement) {

} */

export type VisualizerComponent = React.FC<VisualizerState>;
