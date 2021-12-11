import { LinkedListAnimationProducer } from "./LinkedListAnimationProducer";
import { GraphicalLinkedListNode } from "../data-structure/GraphicalLinkedListNode";

export class LinkedListSearchAnimationProducer extends LinkedListAnimationProducer {
    public indicateFound(node: GraphicalLinkedListNode) {
        this.timeline.push({
            instructions: {
                targets: [node.boxTarget, node.numberTarget],
                stroke: [
                    { value: '#46B493', duration: 500},
                    { value: '#000000', duration: 200}
                ]
            }
        });
    }

    public indicateNotFound(node: GraphicalLinkedListNode) {
        this.timeline.push({
            instructions: {
                targets: [node.boxTarget, node.numberTarget],
                stroke: [
                    { value: '#FF0000', duration: 500},
                    { value: '#000000', duration: 200}
                ]
            }
        });
    }
}