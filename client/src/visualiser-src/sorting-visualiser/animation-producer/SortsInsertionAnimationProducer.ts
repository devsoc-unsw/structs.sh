import { insertionCodeSnippet } from '../util/codeSnippets';
import { getX, getCx } from '../util/helpers';
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
            this.addSequenceAnimation(x.boxTarget.animate(400).attr({ stroke: colour }));
            this.addSequenceAnimation(x.boxTarget.animate(400).attr({ fill: colour }));
            this.addSequenceAnimation(x.numberTarget.animate(400).attr({ fill: colour }));
        })
        this.finishSequence();
    }

    public swapi(
        from: GraphicalSortsElement,
        fromIndex: number,
        to: GraphicalSortsElement
    ) {
        const xFrom = getX(fromIndex);
        const cxFrom = getCx(fromIndex);
        const xTo = getX(fromIndex + 1);
        const cxTo = getCx(fromIndex + 1);

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
        this.finishSequence();
    }
}