import { Svg } from '@svgdotjs/svg.js';
import { quickCodeSnippet } from '../util/codeSnippets';
import { getX, getCx } from '../util/helpers';
import GraphicalSortsElement from '../data-structure/GraphicalSortsElement';
import SortsAnimationProducer from './SortsAnimationProducer';
import { boxWidth } from '../util/constants';

export default class SortsQuickAnimationProducer extends SortsAnimationProducer {
    public renderQuickCode() {
        this.renderCode(quickCodeSnippet);
    }

    public sameSpot(pointer: Svg) {
        this.addSequenceAnimation(pointer.animate(400).attr({ fill: "#FFBC53" }));
        this.finishSequence();
    }

    public movePointer(pointer: Svg, index: number) {
        this.addSequenceAnimation(pointer.animate(400).x(getX(index) + + boxWidth / 2 - 5));
    }

    public initialisePointer(pointer: Svg, index: number) {
        this.addSequenceAnimation(pointer.animate(1).x(getX(index) + + boxWidth / 2 - 5));
        this.addSequenceAnimation(pointer.animate(100).attr({ opacity: 1 }));
        this.finishSequence();
    }

    public highlightBoxes(array: GraphicalSortsElement[], colourCodes: number[]) {
        array.forEach((x, index) => {
            let colour = '#000000';
            if (colourCodes[index] === 1) {
                colour = '#E22B4F';
            } else if (colourCodes[index] === 2) {
                colour = '#39AF8E';
            } else if (colourCodes[index] === 3) {
                colour = '#FFBC53';
            }
            this.addSequenceAnimation(x.boxTarget.animate(400).attr({ stroke: colour }));
            this.addSequenceAnimation(x.boxTarget.animate(400).attr({ fill: colour }));
            this.addSequenceAnimation(x.numberTarget.animate(400).attr({ fill: colour }));
        })
        this.finishSequence();
    }

    public swapq(
        from: GraphicalSortsElement,
        fromIndex: number,
        to: GraphicalSortsElement,
        toIndex: number
    ) {
        const xFrom = getX(fromIndex);
        const cxFrom = getCx(fromIndex);
        const xTo = getX(toIndex);
        const cxTo = getCx(toIndex);

        this.addSequenceAnimation(to.boxTarget.animate(10).attr({ stroke: '#39AF8E' }));
        this.addSequenceAnimation(to.boxTarget.animate(10).attr({ fill: '#39AF8E' }));
        this.addSequenceAnimation(to.numberTarget.animate(10).attr({ fill: '#39AF8E' }));
        this.finishSequence();

        this.addSequenceAnimation(from.boxTarget.animate().x(xTo));
        this.addSequenceAnimation(from.numberTarget.animate().cx(cxTo));
        this.addSequenceAnimation(to.boxTarget.animate().x(xFrom));
        this.addSequenceAnimation(to.numberTarget.animate().cx(cxFrom));

        this.addSequenceAnimation(from.boxTarget.animate(1).attr({ stroke: '#000000', fill: '#000000' }));
        this.addSequenceAnimation(from.numberTarget.animate(1).attr({ fill: '#000000' }));

        this.addSequenceAnimation(to.boxTarget.animate(1).attr({ stroke: '#000000', fill: '#000000' }));
        this.addSequenceAnimation(to.numberTarget.animate(1).attr({ fill: '#000000' }));
        this.finishSequence();
    }
}