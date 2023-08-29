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

export default class SortsSelectionAnimationProducer extends SortsAnimationProducer {
    public renderBogoCode() {
        this.renderCode(bogoCodeSnippet);
    }

    // public check(currItem: GraphicalSortsElement) {
    //     this.addSequenceAnimation(currItem.boxTarget.animate(1).attr({ stroke: comparingColor }));
    //     this.addSequenceAnimation(currItem.boxTarget.animate(1).attr({ fill: comparingColor }));
    //     this.addSequenceAnimation(currItem.numberTarget.animate(1).attr({ fill: comparingColor }));
    //     this.addSequenceAnimation(currItem.numberTarget.animate());
    //     this.finishSequence();
    // }

    // public select(newMinItem: GraphicalSortsElement, previousMinItem: GraphicalSortsElement) {
    //     this.addSequenceAnimation(previousMinItem.boxTarget.animate(1).attr({ stroke: defaultColour }));
    //     this.addSequenceAnimation(previousMinItem.boxTarget.animate(1).attr({ fill: defaultColour }));
    //     this.addSequenceAnimation(
    //         previousMinItem.numberTarget.animate(1).attr({ fill: defaultColour })
    //     );
    //     this.addSequenceAnimation(newMinItem.boxTarget.animate(1).attr({ stroke: selectedColor }));
    //     this.addSequenceAnimation(newMinItem.boxTarget.animate(1).attr({ fill: selectedColor }));
    //     this.addSequenceAnimation(newMinItem.numberTarget.animate(1).attr({ fill: selectedColor }));
    //     // Empty animation so that there's a pause
    //     this.addSequenceAnimation(newMinItem.numberTarget.animate());
    //     this.finishSequence();
    // }

    // public selectionSwap(
    //     iItem: GraphicalSortsElement,
    //     iIndex: number,
    //     minItem: GraphicalSortsElement,
    //     minIndex: number
    // ) {
    //     if (iIndex !== minIndex) {
    //         this.addSequenceAnimation(iItem.boxTarget.animate(1).attr({ stroke: selectedColor }));
    //         this.addSequenceAnimation(iItem.boxTarget.animate(1).attr({ fill: selectedColor }));
    //         this.addSequenceAnimation(iItem.numberTarget.animate(1).attr({ fill: selectedColor }));
    //         // Empty animation so that there's a pause
    //         this.addSequenceAnimation(iItem.numberTarget.animate());
    //     }
    //     this.swap(iItem, iIndex, minItem, minIndex);
    // }

    // public finishSelectionRound(
    //     newIthItem: GraphicalSortsElement,
    //     prevIthItem: GraphicalSortsElement,
    //     ithItemChanged: boolean
    // ) {
    //     this.addSequenceAnimation(newIthItem.boxTarget.animate(1).attr({ stroke: sortedColour }));
    //     this.addSequenceAnimation(newIthItem.boxTarget.animate(1).attr({ fill: sortedColour }));
    //     this.addSequenceAnimation(newIthItem.numberTarget.animate(1).attr({ fill: sortedColour }));
    //     this.addSequenceAnimation(newIthItem.numberTarget.animate());
    //     if (ithItemChanged) {
    //         this.addSequenceAnimation(prevIthItem.boxTarget.animate(1).attr({ stroke: defaultColour }));
    //         this.addSequenceAnimation(prevIthItem.boxTarget.animate(1).attr({ fill: defaultColour }));
    //         this.addSequenceAnimation(prevIthItem.numberTarget.animate(1).attr({ fill: defaultColour }));
    //     }
    // }

    // public bufferUnhighlight(prevMin: GraphicalSortsElement) {
    //     this.addSequenceAnimation(prevMin.boxTarget.animate(1).attr({ stroke: defaultColour }));
    //     this.addSequenceAnimation(prevMin.boxTarget.animate(1).attr({ fill: defaultColour }));
    //     this.addSequenceAnimation(prevMin.numberTarget.animate(1).attr({ fill: defaultColour }));
    // }

    // public highlightAll(array: GraphicalSortsElement[], color: string) {
    //     array.forEach((item) => {
    //         this.addSequenceAnimation(item.boxTarget.animate(1).attr({ stroke: color }));
    //         this.addSequenceAnimation(item.boxTarget.animate(1).attr({ fill: color }));
    //         this.addSequenceAnimation(item.numberTarget.animate(1).attr({ fill: color }));
    //         // Empty animation so that there's a pause
    //         this.addSequenceAnimation(item.numberTarget.animate());
    //     });
    //     this.finishSequence();
    // }
}
