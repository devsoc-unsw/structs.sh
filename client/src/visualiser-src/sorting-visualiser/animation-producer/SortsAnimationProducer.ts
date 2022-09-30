import AnimationProducer from '../../common/AnimationProducer';
import GraphicalSortsElement from '../data-structure/GraphicalSortsElement';
import { getCx, getX } from '../util/helpers';

export default class SortsAnimationProducer extends AnimationProducer {
    public highlightingBoxes(array: GraphicalSortsElement[], colour: string) {
        array.forEach((x) => {
            this.addSequenceAnimation(x.boxTarget.animate(400).attr({ stroke: colour }));
            this.addSequenceAnimation(x.boxTarget.animate(400).attr({ fill: colour }));
            this.addSequenceAnimation(x.numberTarget.animate(400).attr({ fill: colour }));
        })
    }

    public highlightedBoxes(array: GraphicalSortsElement[], colour: string) {
        this.highlightingBoxes(array, colour);
        this.finishSequence();
    }


    public swapping(
        from: GraphicalSortsElement,
        fromIndex: number,
        to: GraphicalSortsElement,
        toIndex: number,
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

    public swapped(
        from: GraphicalSortsElement,
        fromIndex: number,
        to: GraphicalSortsElement,
        toIndex: number,
    ) {
        this.swapping(from, fromIndex, to, toIndex);
        this.finishSequence();
    }
}
