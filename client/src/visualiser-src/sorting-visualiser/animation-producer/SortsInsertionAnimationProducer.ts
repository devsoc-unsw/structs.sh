import { insertionCodeSnippet } from '../util/codeSnippets';
import { getX, getCx } from '../util/helpers';
import GraphicalSortsElement from '../data-structure/GraphicalSortsElement';
import SortsAnimationProducer from './SortsAnimationProducer';

export default class SortsInsertionAnimationProducer extends SortsAnimationProducer {
    public renderInsertionCode() {
        this.renderCode(insertionCodeSnippet);
    }

    public highlightUnsortedArray(array: GraphicalSortsElement[], length: number) {
        for (let i = 1; i < length; i += 1) {
            this.addSequenceAnimation(array[i].boxTarget.animate(400).attr({ stroke: '#cc3131' }));
            this.addSequenceAnimation(array[i].boxTarget.animate(400).attr({ fill: '#cc3131' }));
            this.addSequenceAnimation(array[i].numberTarget.animate(500).attr({ fill: '#cc3131' }));
        }
        this.finishSequence();
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

        // this.addSequenceAnimation(from.boxTarget.animate(200).attr({ stroke: '#39AF8E' }));
        // this.addSequenceAnimation(from.boxTarget.animate(200).attr({ fill: '#39AF8E' }));
        // this.addSequenceAnimation(from.numberTarget.animate(200).attr({ fill: '#39AF8E' }));
        // this.finishSequence();

        this.addSequenceAnimation(from.boxTarget.animate().x(xTo));
        this.addSequenceAnimation(from.numberTarget.animate().cx(cxTo));
        this.addSequenceAnimation(to.boxTarget.animate().x(xFrom));
        this.addSequenceAnimation(to.numberTarget.animate().cx(cxFrom));


        this.addSequenceAnimation(
            from.boxTarget.animate(1).attr({ stroke: '#000000', fill: '#000000' })
        );
        this.addSequenceAnimation(from.numberTarget.animate(1).attr({ fill: '#000000' }));
        if (isLast) {
            this.addSequenceAnimation(to.boxTarget.animate(300).attr({ stroke: '#000000', fill: '#000000' }));
            this.addSequenceAnimation(to.numberTarget.animate(300).attr({ fill: '#000000' }));
        }
        this.finishSequence();
    }

    public compare(item1: GraphicalSortsElement, item2: GraphicalSortsElement, isLast: boolean) {
        if (item2.boxTarget.fill() !== '#39AF8E') {
            this.addSequenceAnimation(item2.boxTarget.animate(200).attr({ stroke: '#39AF8E' }));
            this.addSequenceAnimation(item2.boxTarget.animate(200).attr({ fill: '#39AF8E' }));
            this.addSequenceAnimation(item2.numberTarget.animate(200).attr({ fill: '#39AF8E' }));
            this.addSequenceAnimation(item1.numberTarget.animate().attr({ opacity: 1 }));
            this.finishSequence();
        }

        this.addSequenceAnimation(item1.boxTarget.animate(100).attr({ stroke: '#bfbf84' }));
        this.addSequenceAnimation(item1.numberTarget.animate(100).attr({ fill: '#bfbf84' }));
        this.addSequenceAnimation(item1.boxTarget.animate(100).attr({ fill: '#bfbf84' }));
        this.finishSequence();

        // TODO pause for a bit and highlight while loop
        this.addSequenceAnimation(item1.boxTarget.animate(200).attr({ stroke: '#bfbf84' }));
        this.addSequenceAnimation(item1.numberTarget.animate(200).attr({ fill: '#bfbf84' }));
        this.addSequenceAnimation(item1.boxTarget.animate(200).attr({ fill: '#bfbf84' }));
        this.finishSequence();


        // Unhighlights the comparison of the last two boxes
        if (isLast) {
            console.log("hello")
            this.addSequenceAnimation(item2.boxTarget.animate(1).attr({ stroke: '#000000' }));
            this.addSequenceAnimation(item2.boxTarget.animate(1).attr({ fill: '#000000' }));
            this.addSequenceAnimation(item2.numberTarget.animate(1).attr({ fill: '#000000' }));
            this.addSequenceAnimation(item1.boxTarget.animate(200).attr({ stroke: '#000000' }));
            this.addSequenceAnimation(item1.boxTarget.animate(200).attr({ fill: '#000000' }));
            this.addSequenceAnimation(item1.numberTarget.animate(200).attr({ fill: '#000000' }));
        }
    }
}