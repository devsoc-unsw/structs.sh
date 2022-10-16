import { mergeCodeSnippet } from "../util/codeSnippets";
import { getX, getCx, getY } from '../util/helpers';
import GraphicalSortsElement from "../data-structure/GraphicalSortsElement";
import SortsAnimationProducer from "./SortsAnimationProducer";
import { textCy, defaultColour, sortedColour, checkingColour } from "../util/constants";

export default class SortsMergeAnimationProducer extends SortsAnimationProducer {
    public renderMergeCode() {
        this.renderCode(mergeCodeSnippet);
    }

    public highlightSorting(low: number, high: number, elemensList: GraphicalSortsElement[]) {
        for (let i = low; i <= high; i += 1) {
            this.addSequenceAnimation(elemensList[i].boxTarget.animate().attr({ fill: checkingColour }));
            this.addSequenceAnimation(elemensList[i].numberTarget.animate().attr({ fill: checkingColour }));
            this.addSequenceAnimation(elemensList[i].boxTarget.animate().attr({ stroke: checkingColour }));
            this.addSequenceAnimation(elemensList[i].numberTarget.animate().attr({ stroke: checkingColour }));
        }
    }

    public compareLowerandEqual(first: GraphicalSortsElement, second: GraphicalSortsElement): boolean {
        // highlight color to green
        this.addSequenceAnimation(first.boxTarget.animate(300).attr({ opacity: 0.6 }))
        this.addSequenceAnimation(second.boxTarget.animate(300).attr({ opacity: 0.6 }))
        this.finishSequence();

        // compare the two values and return the boolean value
        if (first.data.value <= second.data.value) {
            return true;
        } 
        return false;
    }

    public moveDown(element: GraphicalSortsElement, index: number) {
        // get the target position
        const xTo = getX(index);
        const cxTo = getCx(index);
        const yTo = getY(element.data.value) + 120;
        const cyTo = 350;

        // move down the box
        this.addSequenceAnimation(element.boxTarget.animate().x(xTo).y(yTo));
        this.addSequenceAnimation(element.numberTarget.animate().cx(cxTo).cy(cyTo));
        this.addSequenceAnimation(element.boxTarget.animate().attr({ opacity: 1 }))

        this.addSequenceAnimation(element.boxTarget.animate(1).attr({ stroke: sortedColour }));
        this.addSequenceAnimation(element.boxTarget.animate(1).attr({ fill: sortedColour }));
        this.addSequenceAnimation(element.numberTarget.animate(1).attr({ fill: sortedColour }));
    }

    public moveUp(element: GraphicalSortsElement, index: number) {
        // get the target position
        const xTo = getX(index);
        const cxTo = getCx(index);
        const yTo = getY(element.data.value);

        // change the color back to balck
        this.addSequenceAnimation(element.boxTarget.animate(1).attr({ stroke: defaultColour }));
        this.addSequenceAnimation(element.boxTarget.animate(1).attr({ fill: defaultColour }));
        this.addSequenceAnimation(element.numberTarget.animate(1).attr({ fill: defaultColour }));

        // move up the box
        this.addSequenceAnimation(element.boxTarget.animate().x(xTo).y(yTo));
        this.addSequenceAnimation(element.numberTarget.animate().cx(cxTo).cy(textCy));
    }

}