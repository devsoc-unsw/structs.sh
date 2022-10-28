import { Svg } from '@svgdotjs/svg.js';
import { quickCodeSnippet } from '../util/codeSnippets';
import { getX, getCx } from '../util/helpers';
import GraphicalSortsElement from '../data-structure/GraphicalSortsElement';
import SortsAnimationProducer from './SortsAnimationProducer';
import { boxWidth, oragneColour, defaultColour, redColour, greenColour } from '../util/constants';

export default class SortsQuickAnimationProducer extends SortsAnimationProducer {
    public renderQuickCode() {
        this.renderCode(quickCodeSnippet);
    }

    public highlightPointer(pointer: Svg, colour: string) {
        this.addSequenceAnimation(pointer.animate(300).attr({ fill: colour }));
        this.finishSequence();
    }

    public highlightPointers(pointer: Svg, colour: string, pointer2: Svg, colour2: string) {
        this.addSequenceAnimation(pointer.animate(300).attr({ fill: colour }));
        this.addSequenceAnimation(pointer2.animate(300).attr({ fill: colour2 }));
    }

    public initialisePointer(pointer: Svg, index: number, colour: string) {
        this.addSequenceAnimation(pointer.animate(300).x(getX(index) + + boxWidth / 2 - 5));
        this.addSequenceAnimation(pointer.animate(300).attr({ fill: colour }));
        this.addSequenceAnimation(pointer.animate(300).attr({ opacity: 1 }));
    }

    public initialisePointers(pointer: Svg, index: number, colour: string, pointer2: Svg, index2: number, colour2: string) {
        this.addSequenceAnimation(pointer.animate(300).x(getX(index) + + boxWidth / 2 - 5));
        this.addSequenceAnimation(pointer.animate(300).attr({ fill: colour }));

        if (pointer.opacity() === 0) {
            this.addSequenceAnimation(pointer.animate(300).attr({ opacity: 1 }));
        }

        this.addSequenceAnimation(pointer2.animate(300).x(getX(index2) + + boxWidth / 2 - 5));
        this.addSequenceAnimation(pointer2.animate(300).attr({ fill: colour2 }));
        if (pointer2.opacity() === 0) {
            this.addSequenceAnimation(pointer2.animate(300).attr({ opacity: 1 }));
        }
    }

    public showPointer(pointer: Svg) {
        this.addSequenceAnimation(pointer.animate(300).attr({ opacity: 1 }));
        this.finishSequence();
    }

    public hidePointer(pointer: Svg) {
        this.addSequenceAnimation(pointer.animate(300).attr({ opacity: 0 }));
        this.finishSequence();
    }

    public greyOut(array: GraphicalSortsElement[], lo: number, hi: number) {
        array.forEach((x, i) => {
            if (i < lo || i > hi) {
                this.addSequenceAnimation(x.boxTarget.animate(300).attr({ opacity: 0.3 }));
                this.addSequenceAnimation(x.numberTarget.animate(300).attr({ opacity: 0.3 }));
            } else {
                this.addSequenceAnimation(x.boxTarget.animate(300).attr({ opacity: 1 }));
                this.addSequenceAnimation(x.numberTarget.animate(300).attr({ opacity: 1 }));
            }
        })
    }

    public hidePointers(pointer: Svg, pointer2: Svg) {
        this.addSequenceAnimation(pointer.animate(300).attr({ opacity: 0 }));
        this.addSequenceAnimation(pointer2.animate(300).attr({ opacity: 0 }));
        this.finishSequence();
    }

    public movePointer(pointer: Svg, index: number) {
        this.addSequenceAnimation(pointer.animate(300).x(getX(index) + + boxWidth / 2 - 5));
        this.addSequenceAnimation(pointer.animate(300).attr({ opacity: 1 }));
    }

    public makeSolved(array: GraphicalSortsElement[]) {
        this.highlightingBoxes(array, greenColour);
        array.forEach((x) => {
            this.addSequenceAnimation(x.boxTarget.animate(300).attr({ opacity: 1 }));
            this.addSequenceAnimation(x.numberTarget.animate(300).attr({ opacity: 1 }));
        })
        this.finishSequence();

        this.highlightBoxes(array, defaultColour);
    }

    public swapq(
        from: GraphicalSortsElement,
        fromIndex: number,
        to: GraphicalSortsElement,
        toIndex: number
    ) {
        const x = "#36CBCC";
        // this.highlightBoxes([from, to], x);
        this.swapping(from, fromIndex, to, toIndex);
        // this.highlightBoxes([from, to], defaultColour);
    }
}