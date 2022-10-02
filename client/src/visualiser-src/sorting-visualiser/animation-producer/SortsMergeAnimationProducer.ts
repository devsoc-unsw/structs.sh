import { mergeCodeSnippet } from "../util/codeSnippets";
import { getX, getCx, getY } from '../util/helpers';
import GraphicalSortsElement from "../data-structure/GraphicalSortsElement";
import SortsAnimationProducer from "./SortsAnimationProducer";
import { textCy } from "../util/constants";

export default class SortsMergeAnimationProducer extends SortsAnimationProducer {
    public renderMergeCode() {
        this.renderCode(mergeCodeSnippet);
    }

    public compareLowerandEqual(first: GraphicalSortsElement, second: GraphicalSortsElement): boolean {
        // highlight color to green
        this.addSequenceAnimation(first.boxTarget.animate(10).attr({ stroke: '#39AF8E' }));
        this.addSequenceAnimation(second.boxTarget.animate(10).attr({ stroke: '#39AF8E' }));
        this.addSequenceAnimation(first.boxTarget.animate(10).attr({ fill: '#39AF8E' }));
        this.addSequenceAnimation(second.boxTarget.animate(10).attr({ fill: '#39AF8E' }));
        this.addSequenceAnimation(first.numberTarget.animate(10).attr({ fill: '#39AF8E' }));
        this.addSequenceAnimation(second.numberTarget.animate(10).attr({ fill: '#39AF8E' }));
        this.addSequenceAnimation(first.numberTarget.animate().attr({ opacity: 1 }));
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

        this.addSequenceAnimation(element.boxTarget.animate(1).attr({ stroke: '#39AF8E' }));
        this.addSequenceAnimation(element.boxTarget.animate(1).attr({ fill: '#39AF8E' }));
        this.addSequenceAnimation(element.numberTarget.animate(1).attr({ fill: '#39AF8E' }));
    }

    public moveUp(element: GraphicalSortsElement, index: number) {
        // get the target position
        const xTo = getX(index);
        const cxTo = getCx(index);
        const yTo = getY(element.data.value);

        // change the color back to balck
        this.addSequenceAnimation(element.boxTarget.animate(1).attr({ stroke: '#000000' }));
        this.addSequenceAnimation(element.boxTarget.animate(1).attr({ fill: '#000000' }));
        this.addSequenceAnimation(element.numberTarget.animate(1).attr({ fill: '#000000' }));

        // move up the box
        this.addSequenceAnimation(element.boxTarget.animate().x(xTo).y(yTo));
        this.addSequenceAnimation(element.numberTarget.animate().cx(cxTo).cy(textCy));
    }

}