import { mergeCodeSnippet } from "../util/codeSnippets";
import { getX, getCx, getY } from '../util/helpers';
import GraphicalSortsElement from "../data-structure/GraphicalSortsElement";
import SortsAnimationProducer from "./SortsAnimationProducer";
import { textCy, defaultColour, sortedColour, checkingColour, selectedColor } from "../util/constants";

export default class SortsMergeAnimationProducer extends SortsAnimationProducer {
    public renderMergeCode() {
        this.renderCode(mergeCodeSnippet);
    }

    public highlightSorting(low: number, high: number, elementList: GraphicalSortsElement[]) {
        for (let i = low; i <= high; i += 1) {
            this.addSequenceAnimation(elementList[i].boxTarget.animate().attr({ fill: checkingColour }));
            this.addSequenceAnimation(elementList[i].numberTarget.animate().attr({ fill: checkingColour }));
            this.addSequenceAnimation(elementList[i].boxTarget.animate().attr({ stroke: checkingColour }));
            this.addSequenceAnimation(elementList[i].numberTarget.animate().attr({ stroke: checkingColour }));
        }
    }

    public highlightTwoBoxes(first: GraphicalSortsElement, second: GraphicalSortsElement) {
        this.addSequenceAnimation(first.boxTarget.animate().attr({ fill: selectedColor }));
        this.addSequenceAnimation(first.boxTarget.animate().attr({ stroke: selectedColor }));
        this.addSequenceAnimation(first.numberTarget.animate().attr({ fill: selectedColor }));
        this.addSequenceAnimation(second.boxTarget.animate().attr({ fill: selectedColor }));
        this.addSequenceAnimation(second.boxTarget.animate().attr({ stroke: selectedColor }));
        this.addSequenceAnimation(second.numberTarget.animate().attr({ fill: selectedColor }));
        this.finishSequence();
    }

    public moveDown(element: GraphicalSortsElement, index: number) {
        const xTo = getX(index);
        const cxTo = getCx(index);
        const yTo = getY(element.data.value) + 120;
        const cyTo = 350;

        this.addSequenceAnimation(element.boxTarget.animate().x(xTo).y(yTo));
        this.addSequenceAnimation(element.numberTarget.animate().cx(cxTo).cy(cyTo));
        this.addSequenceAnimation(element.boxTarget.animate().attr({ opacity: 1 }))

        this.addSequenceAnimation(element.boxTarget.animate(1).attr({ stroke: sortedColour }));
        this.addSequenceAnimation(element.boxTarget.animate(1).attr({ fill: sortedColour }));
        this.addSequenceAnimation(element.numberTarget.animate(1).attr({ fill: sortedColour }));
    }

    public moveUp(element: GraphicalSortsElement, index: number) {
        const xTo = getX(index);
        const cxTo = getCx(index);
        const yTo = getY(element.data.value);

        this.addSequenceAnimation(element.boxTarget.animate(1).attr({ stroke: defaultColour }));
        this.addSequenceAnimation(element.boxTarget.animate(1).attr({ fill: defaultColour }));
        this.addSequenceAnimation(element.numberTarget.animate(1).attr({ fill: defaultColour }));

        this.addSequenceAnimation(element.boxTarget.animate().x(xTo).y(yTo));
        this.addSequenceAnimation(element.numberTarget.animate().cx(cxTo).cy(textCy));
    }

}