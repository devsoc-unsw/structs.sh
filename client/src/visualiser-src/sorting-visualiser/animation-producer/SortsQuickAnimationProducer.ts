import { Polygon, Svg } from '@svgdotjs/svg.js';
import { quickCodeSnippet } from '../util/codeSnippets';
import { getX } from '../util/helpers';
import GraphicalSortsElement from '../data-structure/GraphicalSortsElement';
import SortsAnimationProducer from './SortsAnimationProducer';
import { boxWidth, defaultColour, sortedColour } from '../util/constants';

export default class SortsQuickAnimationProducer extends SortsAnimationProducer {
  public renderQuickCode() {
    this.renderCode(quickCodeSnippet);
  }

  public highlightPointer(pointer: Svg, colour: string) {
    this.addSequenceAnimation(pointer.animate(300).attr({ fill: colour }));
    this.finishSequence(false);
  }

  public highlightPointers(pointer: Svg, colour: string, pointer2: Svg, colour2: string) {
    this.addSequenceAnimation(pointer.animate(300).attr({ fill: colour }));
    this.addSequenceAnimation(pointer2.animate(300).attr({ fill: colour2 }));
  }

  public initialisePointer(pointer: Svg, index: number, colour: string) {
    this.addSequenceAnimation(pointer.animate(300).x(getX(index) + +boxWidth / 2 - 5));
    this.addSequenceAnimation(pointer.animate(300).attr({ fill: colour }));
    this.addSequenceAnimation(pointer.animate(300).attr({ opacity: 1 }));
  }

  public initialisePointers(
    pointer: Polygon,
    index: number,
    colour: string,
    pointer2: Polygon,
    index2: number,
    colour2: string
  ) {
    if (pointer.opacity() === 0) {
      this.addSequenceAnimation(pointer.animate(300).attr({ opacity: 1 }));
    }
    this.addSequenceAnimation(pointer.animate(300).x(getX(index) + +boxWidth / 2 - 5));
    this.addSequenceAnimation(pointer.animate(300).attr({ fill: colour }));

    if (pointer2.opacity() === 0) {
      this.addSequenceAnimation(pointer2.animate(300).attr({ opacity: 1 }));
    }
    this.addSequenceAnimation(pointer2.animate(300).x(getX(index2) + +boxWidth / 2 - 5));
    this.addSequenceAnimation(pointer2.animate(300).attr({ fill: colour2 }));
  }

  public greyOut(array: GraphicalSortsElement[], lo: number, hi: number) {
    array.forEach((x, i) => {
      if (i < lo || i > hi) {
        this.addSequenceAnimation(x.boxTarget.animate(300).attr({ opacity: 0.3 }));
        this.addSequenceAnimation(x.numberTarget.animate(300).attr({ opacity: 0.3 }));
      } else {
        this.addSequenceAnimation(x.boxTarget.animate(300).attr({ opacity: 1 }));
        this.addSequenceAnimation(x.numberTarget.animate(300).attr({ opacity: 1 }));
      }
    });
  }

  public hidePointers(pointer: Polygon, pointer2: Polygon) {
    this.addSequenceAnimation(pointer.animate(300).attr({ opacity: 0 }));
    this.addSequenceAnimation(pointer2.animate(300).attr({ opacity: 0 }));
    this.finishSequence(false);
  }

  public movePointer(pointer: Svg, index: number) {
    this.addSequenceAnimation(pointer.animate(300).x(getX(index) + +boxWidth / 2 - 5));
    this.addSequenceAnimation(pointer.animate(300).attr({ opacity: 1 }));
  }

  public makeSolved(array: GraphicalSortsElement[]) {
    this.highlightBoxes(array, sortedColour);
    array.forEach((x) => {
      this.addSequenceAnimation(x.boxTarget.animate(300).attr({ opacity: 1 }));
      this.addSequenceAnimation(x.numberTarget.animate(300).attr({ opacity: 1 }));
    });
    this.finishSequence(false);

    this.highlightBoxes(array, defaultColour);
  }
}
