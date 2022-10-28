import AnimationProducer from '../../common/AnimationProducer';
import GraphicalSortsElement from '../data-structure/GraphicalSortsElement';
import { getCx, getX } from '../util/helpers';

export default class SortsAnimationProducer extends AnimationProducer {
    public highlightingBoxes(array: GraphicalSortsElement[], colour: string) {
        array.forEach((x) => {
            this.addSequenceAnimation(x.boxTarget.animate(300).attr({ stroke: colour }));
            this.addSequenceAnimation(x.boxTarget.animate(300).attr({ fill: colour }));
            this.addSequenceAnimation(x.numberTarget.animate(300).attr({ fill: colour }));
        })
        if (array.length > 0) {
            // this.addSequenceAnimation(array[0].boxTarget.animate(400).attr({ rotate: 0 }));
        }
    }

    public highlightBoxes(array: GraphicalSortsElement[], colour: string) {
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

        this.addSequenceAnimation(from.boxTarget.animate(300).x(xTo));
        this.addSequenceAnimation(from.numberTarget.animate(300).cx(cxTo));
        this.addSequenceAnimation(to.boxTarget.animate(300).x(xFrom));
        this.addSequenceAnimation(to.numberTarget.animate(300).cx(cxFrom));
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
