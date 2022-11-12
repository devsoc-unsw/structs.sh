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

    this.addSequenceAnimation(this.animate(from.boxTarget).x(xTo));
    this.addSequenceAnimation(this.animate(from.numberTarget).cx(cxTo));
    this.addSequenceAnimation(this.animate(to.boxTarget).x(xFrom));
    this.addSequenceAnimation(this.animate(to.numberTarget).cx(cxFrom));
    this.finishSequence();
    this.addSequenceAnimation(
      this.animate(to.boxTarget, 1).attr({ stroke: defaultColour, fill: defaultColour })
    );
    this.addSequenceAnimation(this.animate(to.numberTarget, 1).attr({ fill: defaultColour }));
    if (isLast) {
      this.addSequenceAnimation(
        this.animate(from.boxTarget, 1).attr({ stroke: defaultColour, fill: defaultColour })
      );
      this.addSequenceAnimation(this.animate(from.boxTarget, 1).attr({ fill: defaultColour }));
      this.addSequenceAnimation(this.animate(from.numberTarget, 1).attr({ fill: defaultColour }));
    }
  }

  public compare(item1: GraphicalSortsElement, item2: GraphicalSortsElement, isLast: boolean) {
    this.addSequenceAnimation(this.animate(item1.boxTarget, 10).attr({ stroke: sortedColour }));
    this.addSequenceAnimation(this.animate(item2.boxTarget, 10).attr({ stroke: sortedColour }));
    this.addSequenceAnimation(this.animate(item1.boxTarget, 10).attr({ fill: sortedColour }));
    this.addSequenceAnimation(this.animate(item2.boxTarget, 10).attr({ fill: sortedColour }));
    this.addSequenceAnimation(this.animate(item1.numberTarget, 10).attr({ fill: sortedColour }));
    this.addSequenceAnimation(this.animate(item2.numberTarget, 10).attr({ fill: sortedColour }));
    this.addSequenceAnimation(this.animate(item1.numberTarget).attr({ opacity: 1 }));
    this.finishSequence();
    if (item1.data.value <= item2.data.value) {
      this.addSequenceAnimation(this.animate(item1.boxTarget, 1).attr({ stroke: defaultColour }));
      this.addSequenceAnimation(this.animate(item1.boxTarget, 1).attr({ fill: defaultColour }));
      this.addSequenceAnimation(this.animate(item1.numberTarget, 1).attr({ fill: defaultColour }));
    }
    if (isLast) {
      this.addSequenceAnimation(this.animate(item2.boxTarget, 1).attr({ stroke: defaultColour }));
      this.addSequenceAnimation(this.animate(item2.boxTarget, 1).attr({ fill: defaultColour }));
      this.addSequenceAnimation(this.animate(item2.numberTarget, 1).attr({ fill: defaultColour }));
    }
  }
}
