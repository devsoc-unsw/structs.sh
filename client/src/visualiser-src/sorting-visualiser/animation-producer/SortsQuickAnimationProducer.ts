import { Svg } from '@svgdotjs/svg.js';
import { quickCodeSnippet } from '../util/codeSnippets';
import { getX, getCx } from '../util/helpers';
import GraphicalSortsElement from '../data-structure/GraphicalSortsElement';
import SortsAnimationProducer from './SortsAnimationProducer';
import { boxWidth, checkingColour, defaultColour, sortedColour } from '../util/constants';

export default class SortsQuickAnimationProducer extends SortsAnimationProducer {
    public renderQuickCode() {
        this.renderCode(quickCodeSnippet);
    }

    public highlightPointer(pointer: Svg, colour: string) {
        this.addSequenceAnimation(pointer.animate(400).attr({ fill: colour }));
        this.finishSequence();
    }

    public initialisePointer(pointer: Svg, index: number) {
        this.addSequenceAnimation(pointer.animate(1).x(getX(index) + + boxWidth / 2 - 5));
        this.addSequenceAnimation(pointer.animate(300).attr({ opacity: 1 }));
        this.finishSequence();
    }

    public showPointer(pointer: Svg) {
        this.addSequenceAnimation(pointer.animate(400).attr({ opacity: 1 }));
        this.finishSequence();
    }

    public hidePointer(pointer: Svg) {
        this.addSequenceAnimation(pointer.animate(400).attr({ opacity: 0 }));
        this.finishSequence();
    }

    public movePointer(pointer: Svg, index: number) {
        this.addSequenceAnimation(pointer.animate(400).x(getX(index) + + boxWidth / 2 - 5));
        this.finishSequence();
    }

    public swapq(
        from: GraphicalSortsElement,
        fromIndex: number,
        to: GraphicalSortsElement,
        toIndex: number
    ) {
        this.highlightBoxes([from, to], sortedColour);
        this.swapped(from, fromIndex, to, toIndex);
        this.highlightBoxes([from, to], defaultColour);
    }
}