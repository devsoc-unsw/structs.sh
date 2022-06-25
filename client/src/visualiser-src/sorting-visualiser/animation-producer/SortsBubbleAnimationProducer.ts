import { bubbleCodeSnippet } from '../util/codeSnippets';
import { getX, getCx } from '../util/helpers';
import GraphicalSortsElement from '../data-structure/GraphicalSortsElement';
import SortsAnimationProducer from './SortsAnimationProducer';

export default class SortsBubbleAnimationProducer extends SortsAnimationProducer {
  public renderBubbleCode() {
    this.renderCode(bubbleCodeSnippet);
  }

  public swap(
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
    this.addSequenceAnimation(to.boxTarget.animate(1).attr({ stroke: '#000000', fill: '#000000' }));
    this.addSequenceAnimation(to.numberTarget.animate(1).attr({ fill: '#000000' }));
    if (isLast) {
      this.addSequenceAnimation(
        from.boxTarget.animate(1).attr({ stroke: '#000000', fill: '#000000' })
      );
      this.addSequenceAnimation(from.boxTarget.animate(1).attr({ fill: '#000000' }));
      this.addSequenceAnimation(from.numberTarget.animate(1).attr({ fill: '#000000' }));
    }
  }

  public compare(item1: GraphicalSortsElement, item2: GraphicalSortsElement, isLast: boolean) {
    this.addSequenceAnimation(item1.boxTarget.animate(10).attr({ stroke: '#4beb9b' }));
    this.addSequenceAnimation(item2.boxTarget.animate(10).attr({ stroke: '#4beb9b' }));
    this.addSequenceAnimation(item1.boxTarget.animate(10).attr({ fill: '#4beb9b' }));
    this.addSequenceAnimation(item2.boxTarget.animate(10).attr({ fill: '#4beb9b' }));
    this.addSequenceAnimation(item1.numberTarget.animate(10).attr({ fill: '#4beb9b' }));
    this.addSequenceAnimation(item2.numberTarget.animate(10).attr({ fill: '#4beb9b' }));
    this.addSequenceAnimation(item1.numberTarget.animate().attr({ opacity: 1 }));
    this.finishSequence();
    if (item1.data.value <= item2.data.value) {
      this.addSequenceAnimation(item1.boxTarget.animate(1).attr({ stroke: '#000000' }));
      this.addSequenceAnimation(item1.boxTarget.animate(1).attr({ fill: '#000000' }));
      this.addSequenceAnimation(item1.numberTarget.animate(1).attr({ fill: '#000000' }));
    }
    if (isLast) {
      this.addSequenceAnimation(item2.boxTarget.animate(1).attr({ stroke: '#000000' }));
      this.addSequenceAnimation(item2.boxTarget.animate(1).attr({ fill: '#000000' }));
      this.addSequenceAnimation(item2.numberTarget.animate(1).attr({ fill: '#000000' }));
    }
  }
}
