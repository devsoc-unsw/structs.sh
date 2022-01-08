import { LinkedListAnimationProducer } from './LinkedListAnimationProducer'
import { GraphicalLinkedListNode } from '../data-structure/GraphicalLinkedListNode'
import { CANVAS, nodePathWidth } from '../util/constants';
export class LinkedListAppendAnimationProducer extends LinkedListAnimationProducer {
    linkLastToNew(last: GraphicalLinkedListNode) {
        this.timeline.push({
            instructions: {
                targets: last.pointerTarget,
                opacity: 1
            }
        })
    }

    addNodeAtEnd(length: number, newNode: GraphicalLinkedListNode) {
        document.querySelector(CANVAS).appendChild(newNode.nodeTarget);
        this.timeline.push({
            instructions: {
                targets: newNode.nodeTarget,
                left: (length - 1) * nodePathWidth,
                opacity: 1,
                duration: 1,
            }
        })
    }
    
}