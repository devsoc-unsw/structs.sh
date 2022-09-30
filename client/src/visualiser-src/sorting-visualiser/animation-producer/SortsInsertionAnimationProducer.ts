import { insertionCodeSnippet } from '../util/codeSnippets';
import GraphicalSortsElement from '../data-structure/GraphicalSortsElement';
import SortsAnimationProducer from './SortsAnimationProducer';

export default class SortsInsertionAnimationProducer extends SortsAnimationProducer {
    public renderInsertionCode() {
        this.renderCode(insertionCodeSnippet);
    }

    public highlightBoxes(array: GraphicalSortsElement[], colourCode: number) {
        let colour = '#000000';
        if (colourCode === 1) {
            colour = '#E22B4F';
        } else if (colourCode === 2) {
            colour = '#39AF8E';
        } else if (colourCode === 3) {
            colour = '#FFBC53';
        }
        array.forEach((x) => {
            this.addSequenceAnimation(x.boxTarget.animate(1).attr({ stroke: colour }));
            this.addSequenceAnimation(x.boxTarget.animate(1).attr({ fill: colour }));
            this.addSequenceAnimation(x.numberTarget.animate(1).attr({ fill: colour }));
        })
        if (array.length > 0) {
            this.addSequenceAnimation(array[0].boxTarget.animate(400).attr({ opacity: 1 }));
        }
        this.finishSequence();
    }

    public swapi(
        from: GraphicalSortsElement,
        fromIndex: number,
        to: GraphicalSortsElement,
        toIndex: number,
        last: boolean
    ) {
        this.swapping(from, fromIndex, to, toIndex);

        this.addSequenceAnimation(from.boxTarget.animate(1).attr({ stroke: '#39AF8E', fill: '#39AF8E' }));
        this.addSequenceAnimation(from.numberTarget.animate(1).attr({ fill: '#39AF8E' }));

        this.finishSequence();
    }
}