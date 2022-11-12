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

  public check(currItem: GraphicalSortsElement) {
    this.addSequenceAnimation(this.animate(currItem.boxTarget, 1).attr({ stroke: comparingColor }));
    this.addSequenceAnimation(this.animate(currItem.boxTarget, 1).attr({ fill: comparingColor }));
    this.addSequenceAnimation(
      this.animate(currItem.numberTarget, 1).attr({ fill: comparingColor })
    );
    this.addSequenceAnimation(this.animate(currItem.numberTarget));
    this.finishSequence();
  }

  public select(newMinItem: GraphicalSortsElement, previousMinItem: GraphicalSortsElement) {
    this.addSequenceAnimation(
      this.animate(previousMinItem.boxTarget, 1).attr({ stroke: defaultColour })
    );
    this.addSequenceAnimation(
      this.animate(previousMinItem.boxTarget, 1).attr({ fill: defaultColour })
    );
    this.addSequenceAnimation(
      this.animate(previousMinItem.numberTarget, 1).attr({ fill: defaultColour })
    );
    this.addSequenceAnimation(
      this.animate(newMinItem.boxTarget, 1).attr({ stroke: selectedColor })
    );
    this.addSequenceAnimation(this.animate(newMinItem.boxTarget, 1).attr({ fill: selectedColor }));
    this.addSequenceAnimation(
      this.animate(newMinItem.numberTarget, 1).attr({ fill: selectedColor })
    );
    // Empty animation so that there's a pause
    this.addSequenceAnimation(this.animate(newMinItem.numberTarget));
    this.finishSequence();
  }

  public selectionSwap(
    iItem: GraphicalSortsElement,
    iIndex: number,
    minItem: GraphicalSortsElement,
    minIndex: number
  ) {
    if (iIndex !== minIndex) {
      this.addSequenceAnimation(this.animate(iItem.boxTarget, 1).attr({ stroke: selectedColor }));
      this.addSequenceAnimation(this.animate(iItem.boxTarget, 1).attr({ fill: selectedColor }));
      this.addSequenceAnimation(this.animate(iItem.numberTarget, 1).attr({ fill: selectedColor }));
      // Empty animation so that there's a pause
      this.addSequenceAnimation(this.animate(iItem.numberTarget));
    }
    this.swap(iItem, iIndex, minItem, minIndex);
  }

  public finishSelectionRound(
    newIthItem: GraphicalSortsElement,
    prevIthItem: GraphicalSortsElement,
    ithItemChanged: boolean
  ) {
    this.addSequenceAnimation(this.animate(newIthItem.boxTarget, 1).attr({ stroke: sortedColour }));
    this.addSequenceAnimation(this.animate(newIthItem.boxTarget, 1).attr({ fill: sortedColour }));
    this.addSequenceAnimation(
      this.animate(newIthItem.numberTarget, 1).attr({ fill: sortedColour })
    );
    this.addSequenceAnimation(this.animate(newIthItem.numberTarget));
    if (ithItemChanged) {
      this.addSequenceAnimation(
        this.animate(prevIthItem.boxTarget, 1).attr({ stroke: defaultColour })
      );
      this.addSequenceAnimation(
        this.animate(prevIthItem.boxTarget, 1).attr({ fill: defaultColour })
      );
      this.addSequenceAnimation(
        this.animate(prevIthItem.numberTarget, 1).attr({ fill: defaultColour })
      );
    }
  }

  public bufferUnhighlight(prevMin: GraphicalSortsElement) {
    this.addSequenceAnimation(this.animate(prevMin.boxTarget, 1).attr({ stroke: defaultColour }));
    this.addSequenceAnimation(this.animate(prevMin.boxTarget, 1).attr({ fill: defaultColour }));
    this.addSequenceAnimation(this.animate(prevMin.numberTarget, 1).attr({ fill: defaultColour }));
  }

  public highlightAll(array: GraphicalSortsElement[], color: string) {
    array.forEach((item) => {
      this.addSequenceAnimation(this.animate(item.boxTarget, 1).attr({ stroke: color }));
      this.addSequenceAnimation(this.animate(item.boxTarget, 1).attr({ fill: color }));
      this.addSequenceAnimation(this.animate(item.numberTarget, 1).attr({ fill: color }));
      // Empty animation so that there's a pause
      this.addSequenceAnimation(this.animate(item.numberTarget));
    });
    this.finishSequence();
  }
}
