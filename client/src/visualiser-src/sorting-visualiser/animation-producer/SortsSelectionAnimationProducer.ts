import { selectionCodeSnippet } from '../util/codeSnippets';
import { getX, getCx } from '../util/helpers';
import GraphicalSortsElement from '../data-structure/GraphicalSortsElement';
import SortsAnimationProducer from './SortsAnimationProducer';
import {
  defaultColour,
  sortedColour,
  checkingColour,
  comparingColor,
  selectedColor,
} from '../util/constants';

export default class SortsSelectionAnimationProducer extends SortsAnimationProducer {
  public renderSelectionCode() {
    this.renderCode(selectionCodeSnippet);
  }

  public compare(currMinItem: GraphicalSortsElement, currItem: GraphicalSortsElement) {
    this.addSequenceAnimation(currItem.boxTarget.animate(100).attr({ stroke: comparingColor }));
    this.addSequenceAnimation(currItem.boxTarget.animate(100).attr({ fill: comparingColor }));
    this.addSequenceAnimation(currItem.numberTarget.animate(100).attr({ fill: comparingColor }));
    this.addSequenceAnimation(currItem.numberTarget.animate());
    this.finishSequence();
    // Unhighlight item if it is not a new minimum
    // if (currMinItem.data.value <= currItem.data.value) {
    //   this.addSequenceAnimation(currItem.boxTarget.animate(100).attr({ stroke: defaultColour }));
    //   this.addSequenceAnimation(currItem.boxTarget.animate(100).attr({ fill: defaultColour }));
    //   this.addSequenceAnimation(currItem.numberTarget.animate(100).attr({ fill: defaultColour }));
    // }
  }

  public select(newMinItem: GraphicalSortsElement, previousMinItem: GraphicalSortsElement) {
    this.addSequenceAnimation(
      previousMinItem.boxTarget.animate(100).attr({ stroke: defaultColour })
    );
    this.addSequenceAnimation(previousMinItem.boxTarget.animate(100).attr({ fill: defaultColour }));
    this.addSequenceAnimation(
      previousMinItem.numberTarget.animate(100).attr({ fill: defaultColour })
    );
    this.addSequenceAnimation(newMinItem.boxTarget.animate(100).attr({ stroke: selectedColor }));
    this.addSequenceAnimation(newMinItem.boxTarget.animate(100).attr({ fill: selectedColor }));
    this.addSequenceAnimation(newMinItem.numberTarget.animate(100).attr({ fill: selectedColor }));
    // Empty animation so that there's a pause
    this.addSequenceAnimation(newMinItem.numberTarget.animate());
    this.finishSequence();
  }

  public swap(
    iItem: GraphicalSortsElement,
    iIndex: number,
    minItem: GraphicalSortsElement,
    minIndex: number
  ) {
    if (iIndex !== minIndex) {
      this.addSequenceAnimation(iItem.boxTarget.animate(100).attr({ stroke: checkingColour }));
      this.addSequenceAnimation(iItem.boxTarget.animate(100).attr({ fill: checkingColour }));
      this.addSequenceAnimation(iItem.numberTarget.animate(100).attr({ fill: checkingColour }));
      // Empty animation so that there's a pause
      this.addSequenceAnimation(iItem.numberTarget.animate());
      this.finishSequence();
    }
    this.swapped(iItem, iIndex, minItem, minIndex);
    // this.addSequenceAnimation(minItem.boxTarget.animate(100).attr({ stroke: sortedColour }));
    // this.addSequenceAnimation(minItem.boxTarget.animate(100).attr({ fill: sortedColour }));
    // this.addSequenceAnimation(minItem.numberTarget.animate(100).attr({ fill: sortedColour }));
    // Empty animation
    // this.addSequenceAnimation(minItem.numberTarget.animate());
    // if (iIndex !== minIndex) {
    //   this.addSequenceAnimation(iItem.boxTarget.animate(100).attr({ stroke: defaultColour }));
    //   this.addSequenceAnimation(iItem.boxTarget.animate(100).attr({ fill: defaultColour }));
    //   this.addSequenceAnimation(iItem.numberTarget.animate(100).attr({ fill: defaultColour }));
    // }
  }

  public finishSelectionRound(
    newIthItem: GraphicalSortsElement,
    prevIthItem: GraphicalSortsElement,
    ithItemChanged: boolean
  ) {
    this.addSequenceAnimation(newIthItem.boxTarget.animate(100).attr({ stroke: sortedColour }));
    this.addSequenceAnimation(newIthItem.boxTarget.animate(100).attr({ fill: sortedColour }));
    this.addSequenceAnimation(newIthItem.numberTarget.animate(100).attr({ fill: sortedColour }));
    this.addSequenceAnimation(newIthItem.numberTarget.animate());
    if (ithItemChanged) {
      this.addSequenceAnimation(prevIthItem.boxTarget.animate(100).attr({ stroke: defaultColour }));
      this.addSequenceAnimation(prevIthItem.boxTarget.animate(100).attr({ fill: defaultColour }));
      this.addSequenceAnimation(
        prevIthItem.numberTarget.animate(100).attr({ fill: defaultColour })
      );
    }
  }

  public highlightAll(array: GraphicalSortsElement[], color: string) {
    array.forEach((item) => {
      this.addSequenceAnimation(item.boxTarget.animate(100).attr({ stroke: color }));
      this.addSequenceAnimation(item.boxTarget.animate(100).attr({ fill: color }));
      this.addSequenceAnimation(item.numberTarget.animate(100).attr({ fill: color }));
      // Empty animation so that there's a pause
      this.addSequenceAnimation(item.numberTarget.animate());
    });
    this.finishSequence();
  }
}
