import { bubbleCodeSnippet } from '../util/codeSnippets';
import { getX, getCx } from '../util/helpers';
import GraphicalSortsElement from '../data-structure/GraphicalSortsElement';
import SortsAnimationProducer from './SortsAnimationProducer';
import { defaultColour, sortedColour, checkingColour } from '../util/constants';

export default class SortsBubbleAnimationProducer extends SortsAnimationProducer {
  public renderBubbleCode() {
    this.renderCode(bubbleCodeSnippet);
  }

  public bubbleSwap(
    from: GraphicalSortsElement,
    fromIndex: number,
    to: GraphicalSortsElement,
    isLast: boolean
  ) {
    const xFrom = getX(fromIndex);
    const cxFrom = getCx(fromIndex);
    const xTo = getX(fromIndex + 1);
    const cxTo = getCx(fromIndex + 1);

    this.addSequenceAnimation(from.boxTarget.animate().x(xTo));
    this.addSequenceAnimation(from.numberTarget.animate().cx(cxTo));
    this.addSequenceAnimation(to.boxTarget.animate().x(xFrom));
    this.addSequenceAnimation(to.numberTarget.animate().cx(cxFrom));
    this.finishSequence();
    this.addSequenceAnimation(to.boxTarget.animate(1).attr({ stroke: defaultColour, fill: defaultColour }));
    this.addSequenceAnimation(to.numberTarget.animate(1).attr({ fill: defaultColour }));
    if (isLast) {
      this.addSequenceAnimation(
        from.boxTarget.animate(1).attr({ stroke: defaultColour, fill: defaultColour })
      );
      this.addSequenceAnimation(from.boxTarget.animate(1).attr({ fill: defaultColour }));
      this.addSequenceAnimation(from.numberTarget.animate(1).attr({ fill: defaultColour }));
    }
  }

  public compare(item1: GraphicalSortsElement, item2: GraphicalSortsElement, isLast: boolean) {
    this.addSequenceAnimation(item1.boxTarget.animate(10).attr({ stroke: sortedColour }));
    this.addSequenceAnimation(item2.boxTarget.animate(10).attr({ stroke: sortedColour }));
    this.addSequenceAnimation(item1.boxTarget.animate(10).attr({ fill: sortedColour }));
    this.addSequenceAnimation(item2.boxTarget.animate(10).attr({ fill: sortedColour }));
    this.addSequenceAnimation(item1.numberTarget.animate(10).attr({ fill: sortedColour }));
    this.addSequenceAnimation(item2.numberTarget.animate(10).attr({ fill: sortedColour }));
    this.addSequenceAnimation(item1.numberTarget.animate().attr({ opacity: 1 }));
    this.finishSequence();
    if (item1.data.value <= item2.data.value) {
      this.addSequenceAnimation(item1.boxTarget.animate(1).attr({ stroke: defaultColour }));
      this.addSequenceAnimation(item1.boxTarget.animate(1).attr({ fill: defaultColour }));
      this.addSequenceAnimation(item1.numberTarget.animate(1).attr({ fill: defaultColour }));
    }
    if (isLast) {
      this.addSequenceAnimation(item2.boxTarget.animate(1).attr({ stroke: defaultColour }));
      this.addSequenceAnimation(item2.boxTarget.animate(1).attr({ fill: defaultColour }));
      this.addSequenceAnimation(item2.numberTarget.animate(1).attr({ fill: defaultColour }));
    }
  }
}
