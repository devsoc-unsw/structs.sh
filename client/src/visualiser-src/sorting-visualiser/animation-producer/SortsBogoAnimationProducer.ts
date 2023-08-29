import { bogoCodeSnippet } from '../util/codeSnippets';
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

export default class SortsBogoAnimationProducer extends SortsAnimationProducer {
    public renderBogoCode() {
        this.renderCode(bogoCodeSnippet);
    }

    public bogoSwap(
        from: GraphicalSortsElement,
        fromIndex: number,
        to: GraphicalSortsElement,
        toIndex: number
    ) {
        if (fromIndex !== toIndex) {
            this.bogoCompare(from, to);
            this.addSequenceAnimation(from.numberTarget.animate());
            this.addSequenceAnimation(to.numberTarget.animate());
        }
        this.swap(from, fromIndex, to, toIndex);
        this.finishSequence();
        this.addSequenceAnimation(from.boxTarget.animate(10).attr({ stroke: defaultColour }));
        this.addSequenceAnimation(from.boxTarget.animate(10).attr({ fill: defaultColour }));
        this.addSequenceAnimation(from.numberTarget.animate(10).attr({ fill: defaultColour }));
        this.addSequenceAnimation(to.boxTarget.animate(10).attr({ stroke: defaultColour }));
        this.addSequenceAnimation(to.boxTarget.animate(10).attr({ fill: defaultColour }));
        this.addSequenceAnimation(to.numberTarget.animate(10).attr({ fill: defaultColour }));
        this.finishSequence();
    }

    public bogoCompare(item1: GraphicalSortsElement, item2: GraphicalSortsElement) {
        this.addSequenceAnimation(item1.boxTarget.animate(10).attr({ stroke: comparingColor }));
        this.addSequenceAnimation(item2.boxTarget.animate(10).attr({ stroke: comparingColor }));
        this.addSequenceAnimation(item1.boxTarget.animate(10).attr({ fill: comparingColor }));
        this.addSequenceAnimation(item2.boxTarget.animate(10).attr({ fill: comparingColor }));
        this.addSequenceAnimation(item1.numberTarget.animate(10).attr({ fill: comparingColor }));
        this.addSequenceAnimation(item2.numberTarget.animate(10).attr({ fill: comparingColor }));
        this.addSequenceAnimation(item1.numberTarget.animate().attr({ opacity: 1 }));
        this.finishSequence();
    }

    public UnsortedCompare(item1: GraphicalSortsElement, item2: GraphicalSortsElement) {
        this.addSequenceAnimation(item1.boxTarget.animate(10).attr({ stroke: comparingColor }));
        this.addSequenceAnimation(item2.boxTarget.animate(10).attr({ stroke: comparingColor }));
        this.addSequenceAnimation(item1.boxTarget.animate(10).attr({ fill: comparingColor }));
        this.addSequenceAnimation(item2.boxTarget.animate(10).attr({ fill: comparingColor }));
        this.addSequenceAnimation(item1.numberTarget.animate(10).attr({ fill: comparingColor }));
        this.addSequenceAnimation(item2.numberTarget.animate(10).attr({ fill: comparingColor }));
        this.finishSequence();
    }
}
