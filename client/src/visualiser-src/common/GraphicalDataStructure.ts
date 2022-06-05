import { SVG } from '@svgdotjs/svg.js';
import { Documentation } from './typedefs';
import { VISUALISER_CANVAS } from './constants';

abstract class GraphicalDataStructure {
  public constructor() {
    SVG(VISUALISER_CANVAS).clear();
  }

  // This 'reset' method below won't execute: instead the child's 'reset' method executes. This exists solely to make TypeScript happy.
  // Is there a better solution to this? pls figure out before merging k thanks
  public reset(): void {
    SVG(VISUALISER_CANVAS).clear();
  }

  public abstract get documentation(): Documentation;
}

export default GraphicalDataStructure;
