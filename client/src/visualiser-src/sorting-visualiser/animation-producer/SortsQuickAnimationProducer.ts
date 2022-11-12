import { Polygon, Svg } from '@svgdotjs/svg.js';
import { quickCodeSnippet } from '../util/codeSnippets';
import { getX, getCx } from '../util/helpers';
import GraphicalSortsElement from '../data-structure/GraphicalSortsElement';
import SortsAnimationProducer from './SortsAnimationProducer';
import {
  boxWidth,
  comparingColor,
  defaultColour,
  redColour,
  sortedColour,
} from '../util/constants';

export default class SortsQuickAnimationProducer extends SortsAnimationProducer {
  public renderQuickCode() {
    this.renderCode(quickCodeSnippet);
  }

  public highlightPointer(pointer: Svg, colour: string) {
    this.addSequenceAnimation(this.animate(pointer, 300).attr({ fill: colour }));
    this.finishSequence(false);
  }

  public highlightPointers(pointer: Svg, colour: string, pointer2: Svg, colour2: string) {
    this.addSequenceAnimation(this.animate(pointer, 300).attr({ fill: colour }));
    this.addSequenceAnimation(this.animate(pointer2, 300).attr({ fill: colour2 }));
  }

  public initialisePointer(pointer: Svg, index: number, colour: string) {
    this.addSequenceAnimation(this.animate(pointer, 300).x(getX(index) + +boxWidth / 2 - 5));
    this.addSequenceAnimation(this.animate(pointer, 300).attr({ fill: colour }));
    this.addSequenceAnimation(this.animate(pointer, 300).attr({ opacity: 1 }));
  }

  public initialisePointers(
    pointer: Svg,
    index: number,
    colour: string,
    pointer2: Svg,
    index2: number,
    colour2: string
  ) {
    if (pointer.opacity() === 0) {
      this.addSequenceAnimation(this.animate(pointer, 300).attr({ opacity: 1 }));
    }
    this.addSequenceAnimation(this.animate(pointer, 300).x(getX(index) + +boxWidth / 2 - 5));
    this.addSequenceAnimation(this.animate(pointer, 300).attr({ fill: colour }));

    if (pointer2.opacity() === 0) {
      this.addSequenceAnimation(this.animate(pointer2, 300).attr({ opacity: 1 }));
    }
    this.addSequenceAnimation(this.animate(pointer2, 300).x(getX(index2) + +boxWidth / 2 - 5));
    this.addSequenceAnimation(this.animate(pointer2, 300).attr({ fill: colour2 }));
  }

  public greyOut(array: GraphicalSortsElement[], lo: number, hi: number) {
    array.forEach((x, i) => {
      if (i < lo || i > hi) {
        this.addSequenceAnimation(this.animate(x.boxTarget, 300).attr({ opacity: 0.3 }));
        this.addSequenceAnimation(this.animate(x.numberTarget, 300).attr({ opacity: 0.3 }));
      } else {
        this.addSequenceAnimation(this.animate(x.boxTarget, 300).attr({ opacity: 1 }));
        this.addSequenceAnimation(this.animate(x.numberTarget, 300).attr({ opacity: 1 }));
      }
    });
  }

  public hidePointers(pointer: Polygon, pointer2: Polygon) {
    this.addSequenceAnimation(this.animate(pointer, 300).attr({ opacity: 0 }));
    this.addSequenceAnimation(this.animate(pointer2, 300).attr({ opacity: 0 }));
    this.finishSequence(false);
  }

  public movePointer(pointer: Svg, index: number) {
    this.addSequenceAnimation(this.animate(pointer, 300).x(getX(index) + +boxWidth / 2 - 5));
    this.addSequenceAnimation(this.animate(pointer, 300).attr({ opacity: 1 }));
  }

  public makeSolved(array: GraphicalSortsElement[]) {
    this.highlightBoxes(array, sortedColour);
    array.forEach((x) => {
      this.addSequenceAnimation(this.animate(x.boxTarget, 300).attr({ opacity: 1 }));
      this.addSequenceAnimation(this.animate(x.numberTarget, 300).attr({ opacity: 1 }));
    });
    this.finishSequence(false);

    this.highlightBoxes(array, defaultColour);
  }
}
