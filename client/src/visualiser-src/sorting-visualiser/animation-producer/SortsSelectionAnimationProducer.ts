import { selectionCodeSnippet } from '../util/codeSnippets';
import { getX, getCx } from '../util/helpers';
import GraphicalSortsElement from '../data-structure/GraphicalSortsElement';
import SortsAnimationProducer from './SortsAnimationProducer';
import { defaultColour, sortedColour, checkingColour, comparingColor } from '../util/constants';

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
    if (currMinItem.data.value <= currItem.data.value) {
      this.addSequenceAnimation(currItem.boxTarget.animate(100).attr({ stroke: defaultColour }));
      this.addSequenceAnimation(currItem.boxTarget.animate(100).attr({ fill: defaultColour }));
      this.addSequenceAnimation(currItem.numberTarget.animate(100).attr({ fill: defaultColour }));
    }
  }

  public select(newMinItem: GraphicalSortsElement, previousMinItem: GraphicalSortsElement) {
    this.addSequenceAnimation(
      previousMinItem.boxTarget.animate(100).attr({ stroke: defaultColour })
    );
    this.addSequenceAnimation(previousMinItem.boxTarget.animate(100).attr({ fill: defaultColour }));
    this.addSequenceAnimation(
      previousMinItem.numberTarget.animate(100).attr({ fill: defaultColour })
    );
    this.addSequenceAnimation(newMinItem.boxTarget.animate(100).attr({ stroke: sortedColour }));
    this.addSequenceAnimation(newMinItem.boxTarget.animate(100).attr({ fill: sortedColour }));
    this.addSequenceAnimation(newMinItem.numberTarget.animate(100).attr({ fill: sortedColour }));
    this.addSequenceAnimation(newMinItem.numberTarget.animate());
    this.finishSequence();
  }

  public swap(iItem, iIndex, minItem, minIndex) {
    if (iIndex !== minIndex) {
      this.addSequenceAnimation(iItem.boxTarget.animate(100).attr({ stroke: checkingColour }));
      this.addSequenceAnimation(iItem.boxTarget.animate(100).attr({ fill: checkingColour }));
      this.addSequenceAnimation(iItem.numberTarget.animate(100).attr({ fill: checkingColour }));
      this.addSequenceAnimation(iItem.numberTarget.animate());
      this.finishSequence();
    }
    this.swapped(iItem, iIndex, minItem, minIndex);
    if (iIndex !== minIndex) {
      this.addSequenceAnimation(minItem.boxTarget.animate(100).attr({ stroke: sortedColour }));
      this.addSequenceAnimation(minItem.boxTarget.animate(100).attr({ fill: sortedColour }));
      this.addSequenceAnimation(minItem.numberTarget.animate(100).attr({ fill: sortedColour }));
      this.addSequenceAnimation(iItem.boxTarget.animate(100).attr({ stroke: defaultColour }));
      this.addSequenceAnimation(iItem.boxTarget.animate(100).attr({ fill: defaultColour }));
      this.addSequenceAnimation(iItem.numberTarget.animate(100).attr({ fill: defaultColour }));
    }
  }
}
