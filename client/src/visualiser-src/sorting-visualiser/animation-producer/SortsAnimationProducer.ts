import AnimationProducer from '../../common/AnimationProducer';
import GraphicalSortsElement from '../data-structure/GraphicalSortsElement';
import { getCx, getX } from '../util/helpers';

export default class SortsAnimationProducer extends AnimationProducer {
  public highlightItem(item: GraphicalSortsElement, color: string) {
    this.addSequenceAnimation(this.animate(item.boxTarget, 1).attr({ stroke: color }));
    this.addSequenceAnimation(this.animate(item.boxTarget, 1).attr({ fill: color }));
    this.addSequenceAnimation(this.animate(item.numberTarget, 1).attr({ fill: color }));
    this.addSequenceAnimation(this.animate(item.boxTarget));
  }

  public highlightBoxes(array: GraphicalSortsElement[], colour: string) {
    array.forEach((x) => {
      this.highlightItem(x, colour);
    });
  }

  public swap(
    from: GraphicalSortsElement,
    fromIndex: number,
    to: GraphicalSortsElement,
    toIndex: number
  ) {
    const xFrom = getX(fromIndex);
    const cxFrom = getCx(fromIndex);
    const xTo = getX(toIndex);
    const cxTo = getCx(toIndex);

    this.addSequenceAnimation(this.animate(from.boxTarget).x(xTo));
    this.addSequenceAnimation(this.animate(from.numberTarget).cx(cxTo));
    this.addSequenceAnimation(this.animate(to.boxTarget).x(xFrom));
    this.addSequenceAnimation(this.animate(to.numberTarget).cx(cxFrom));
  }
}
