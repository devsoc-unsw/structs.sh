import AnimationProducer from '../../common/AnimationProducer';
import GraphicalSortsElement from '../data-structure/GraphicalSortsElement';
import { getCx, getX } from '../util/helpers';

export default class SortsAnimationProducer extends AnimationProducer {
  public doHighlightBoxes(array: GraphicalSortsElement[], colour: string) {
    array.forEach((x) => {
      this.addSequenceAnimation(x.boxTarget.animate(1).attr({ stroke: colour }));
      this.addSequenceAnimation(x.boxTarget.animate(1).attr({ fill: colour }));
      this.addSequenceAnimation(x.numberTarget.animate(1).attr({ fill: colour }));
    });
    if (array.length > 0) {
      this.addSequenceAnimation(array[0].boxTarget.animate(400).attr({ opacity: 1 }));
    }
  }

  public highlightBoxes(array: GraphicalSortsElement[], colour: string) {
    this.doHighlightBoxes(array, colour);
    this.finishSequence();
  }

  public highlightItem(item: GraphicalSortsElement, color: string) {
    this.addSequenceAnimation(item.boxTarget.animate(100).attr({ stroke: color }));
    this.addSequenceAnimation(item.boxTarget.animate(100).attr({ fill: color }));
    this.addSequenceAnimation(item.numberTarget.animate(100).attr({ fill: color }));
    this.addSequenceAnimation(item.boxTarget.animate());
  }

  public doSwap(
    from: GraphicalSortsElement,
    fromIndex: number,
    to: GraphicalSortsElement,
    toIndex: number
  ) {
    const xFrom = getX(fromIndex);
    const cxFrom = getCx(fromIndex);
    const xTo = getX(toIndex);
    const cxTo = getCx(toIndex);

    this.addSequenceAnimation(from.boxTarget.animate().x(xTo));
    this.addSequenceAnimation(from.numberTarget.animate().cx(cxTo));
    this.addSequenceAnimation(to.boxTarget.animate().x(xFrom));
    this.addSequenceAnimation(to.numberTarget.animate().cx(cxFrom));
  }

  public swap(
    from: GraphicalSortsElement,
    fromIndex: number,
    to: GraphicalSortsElement,
    toIndex: number
  ) {
    this.doSwap(from, fromIndex, to, toIndex);
    this.finishSequence();
  }
}
