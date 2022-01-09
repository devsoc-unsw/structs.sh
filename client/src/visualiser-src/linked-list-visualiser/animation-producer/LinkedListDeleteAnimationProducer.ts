import { LinkedListAnimationProducer } from './LinkedListAnimationProducer';
import { GraphicalLinkedListNode } from '../data-structure/GraphicalLinkedListNode';
import { RIGHT_ARROW_PATH, BENT_ARROW_PATH } from '../util/constants';

export class LinkedListDeleteAnimationProducer extends LinkedListAnimationProducer {
    setNextToNull(node: GraphicalLinkedListNode) {
        this.timeline.push({
            instructions: {
                targets: node.pointerTarget,
                opacity: 0,
            },
        });
    }

    morphNextPointerToArc(node: GraphicalLinkedListNode) {
        this.timeline.push({
            instructions: {
                targets: node.pointerTarget,
                d: [{ value: RIGHT_ARROW_PATH }, { value: BENT_ARROW_PATH }],
            },
        });
    }

    deleteNode(node: GraphicalLinkedListNode) {
        this.timeline.push({
            instructions: {
                targets: [node.pointerTarget, node.nodeTarget],
                opacity: 0,
            },
        });
    }
}
