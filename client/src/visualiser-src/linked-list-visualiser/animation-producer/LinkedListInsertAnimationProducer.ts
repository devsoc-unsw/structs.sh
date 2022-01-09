import { LinkedListAnimationProducer } from './LinkedListAnimationProducer';
import { GraphicalLinkedListNode } from '../data-structure/GraphicalLinkedListNode';
import {
    CANVAS,
    UP_RIGHT_ARROW_PATH,
    DOWN_RIGHT_ARROW_PATH,
    insertedNodeTopOffset,
    nodePathWidth,
    actualNodeWidth,
} from '../util/constants';

export class LinkedListInsertAnimationProducer extends LinkedListAnimationProducer {
    public insertedNodePointToNext(newNode: GraphicalLinkedListNode) {
        this.timeline.push({
            instructions: {
                targets: newNode.pointerTarget,
                d: UP_RIGHT_ARROW_PATH,
                duration: 1,
            },
        });
        this.timeline.push({
            instructions: {
                targets: newNode.pointerTarget,
                opacity: 1,
            },
        });
    }

    public pointToInsertedNode(node: GraphicalLinkedListNode) {
        this.timeline.push({
            instructions: {
                targets: node.pointerTarget,
                d: DOWN_RIGHT_ARROW_PATH,
            },
        });
    }

    public createNodeAt(index: number, newNode: GraphicalLinkedListNode) {
        document.querySelector(CANVAS).appendChild(newNode.nodeTarget);
        this.timeline.push({
            instructions: {
                targets: newNode.nodeTarget,
                left: index * nodePathWidth + actualNodeWidth,
                top: insertedNodeTopOffset,
                opacity: 1,
                duration: 1,
            },
        });
    }
}
