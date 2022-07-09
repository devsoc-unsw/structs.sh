import { SVG } from '@svgdotjs/svg.js';
import { Documentation } from './typedefs';
import { CODE_CANVAS, VISUALISER_CANVAS, CODE_CONTAINER } from './constants';

abstract class GraphicalDataStructure {
  public constructor() {
    SVG(VISUALISER_CANVAS).clear();
    SVG(CODE_CANVAS).clear();
    // Set the code container height to 0 to prevent scrolling due to overflow
    document.getElementById(CODE_CONTAINER).style.height = '0';
  }

  public abstract get documentation(): Documentation;

  public abstract generate(): void;
}

export default GraphicalDataStructure;
