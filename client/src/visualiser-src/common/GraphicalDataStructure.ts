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

  // Return data of the data structure in the form of an array
  public get data(): number[] {
    return [1, 2, 3];
  }

  // Loads data structure from given data
<<<<<<< HEAD
  public load(data: number[]): void {

  };
=======
  public load(data: number[]): void {}
>>>>>>> 9664a69cb9210b8ac89d475b837fc4b5aac3b250
}

export default GraphicalDataStructure;
