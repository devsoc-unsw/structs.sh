import { Svg } from '@svgdotjs/svg.js';
import { quickCodeSnippet } from '../util/codeSnippets';
import { getX, getCx } from '../util/helpers';
import GraphicalSortsElement from '../data-structure/GraphicalSortsElement';
import SortsAnimationProducer from './SortsAnimationProducer';
import { boxWidth, checkingColour, defaultColour, redColour, sortedColour } from '../util/constants';

export default class SortsQuickAnimationProducer extends SortsAnimationProducer {
    public renderQuickCode() {
        this.renderCode(quickCodeSnippet);
    }

    public highlightPointer(pointer: Svg, colour: string) {
        this.addSequenceAnimation(pointer.animate(400).attr({ fill: colour }));
        this.finishSequence();
    }

    public highlightPointers(pointer: Svg, colour: string, pointer2: Svg, colour2: string) {
        this.addSequenceAnimation(pointer.animate(400).attr({ fill: colour }));
        this.addSequenceAnimation(pointer2.animate(400).attr({ fill: colour2 }));
        this.finishSequence();
    }

    public initialisePointer(pointer: Svg, index: number, colour: string) {
        this.addSequenceAnimation(pointer.animate(400).x(getX(index) + + boxWidth / 2 - 5));
        this.addSequenceAnimation(pointer.animate(400).attr({ fill: colour }));
        this.addSequenceAnimation(pointer.animate(400).attr({ opacity: 1 }));
        this.finishSequence();
    }

    public initialisePointers(pointer: Svg, index: number, colour: string, pointer2: Svg, index2: number, colour2: string) {
        this.addSequenceAnimation(pointer.animate(400).x(getX(index) + + boxWidth / 2 - 5));
        this.addSequenceAnimation(pointer.animate(400).attr({ fill: colour }));
        this.addSequenceAnimation(pointer.animate(400).attr({ opacity: 1 }));

        this.addSequenceAnimation(pointer2.animate(400).x(getX(index2) + + boxWidth / 2 - 5));
        this.addSequenceAnimation(pointer2.animate(400).attr({ fill: colour2 }));
        this.addSequenceAnimation(pointer2.animate(400).attr({ opacity: 1 }));
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

    public greyOut(array: GraphicalSortsElement[], lo: number, hi: number) {
        array.forEach((x, i) => {
            if (lo <= i && i <= hi) {
                ;
            }
        })
    }

    public hidePointers(pointer: Svg, pointer2: Svg) {
        this.addSequenceAnimation(pointer.animate(400).attr({ opacity: 0 }));
        this.addSequenceAnimation(pointer2.animate(400).attr({ opacity: 0 }));
        this.finishSequence();
    }

    public movePointer(pointer: Svg, index: number) {
        this.addSequenceAnimation(pointer.animate(400).x(getX(index) + + boxWidth / 2 - 5));
        this.addSequenceAnimation(pointer.animate(400).attr({ opacity: 1 }));
        this.finishSequence();
    }

    public movePointers(pointer: Svg, index: number, pointer2: Svg, index2: number) {
        this.addSequenceAnimation(pointer.animate(400).x(getX(index) + + boxWidth / 2 - 5));
        this.addSequenceAnimation(pointer2.animate(400).x(getX(index2) + + boxWidth / 2 - 5));
        this.finishSequence();
    }

    public swapq(
        from: GraphicalSortsElement,
        fromIndex: number,
        to: GraphicalSortsElement,
        toIndex: number
    ) {
        this.highlightBoxes([from, to], redColour);
        this.swapped(from, fromIndex, to, toIndex);
        this.highlightBoxes([from, to], defaultColour);
    }
}