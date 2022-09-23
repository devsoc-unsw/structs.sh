import { mergeCodeSnippet } from "../util/codeSnippets";
import GraphicalSortsElement from "../data-structure/GraphicalSortsElement";
import SortsAnimationProducer from "./SortsAnimationProducer";

export default class SortMergeAnimationProducer extends SortsAnimationProducer {
    public renderMergeCode() {
        this.renderCode(mergeCodeSnippet);
    }

    public moveDown(element: GraphicalSortsElement) {
        // ...
    }

    public compareAndMoveDown(first: GraphicalSortsElement, second: GraphicalSortsElement) {
        this.addSequenceAnimation(first.boxTarget.animate(10).attr({ stroke: '#39AF8E', fill: '#39AF8E' }));
        this.addSequenceAnimation(second.boxTarget.animate(10).attr({ stroke: '#39AF8E', fill: '#39AF8E' }));
        this.addSequenceAnimation(first.numberTarget.animate(10).attr({ stroke: '#39AF8E' }));
        this.addSequenceAnimation(second.numberTarget.animate(10).attr({ stroke: '#39AF8E' }));
        this.finishSequence();

        if (first.data.value <= second.data.value) {
            this.moveDown(first);
        } else {
            this.moveDown(second);
        }
    }

    public moveUp(element: GraphicalSortsElement) {
        // ...
    }

    public moveUpElements(elementList: GraphicalSortsElement[]) {
        for (let element of elementList) {
            this.moveUp(element);
        }
    }
}