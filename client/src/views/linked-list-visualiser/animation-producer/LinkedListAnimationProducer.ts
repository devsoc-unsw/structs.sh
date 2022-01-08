import { AnimationInstruction } from '../util/typedefs';
import {
    RIGHT_ARROW_PATH,
    nodePathWidth,
    fastestDuration,
    CURRENT,
    PREV,
    // UP_ARROW_PATH,
    // DOWN_RIGHT_ARROW_PATH,
    // UP_RIGHT_ARROW_PATH,
    // BENT_ARROW_PATH,
    // actualNodeWidth,
    // insertedNodeTopOffset,
    // CANVAS
} from '../util/constants';
import LinkedList from '../data-structure/GraphicalLinkedList';
import { GraphicalLinkedListNode } from '../data-structure/GraphicalLinkedListNode';

export class LinkedListAnimationProducer {
    private _timeline: AnimationInstruction[] = [];

    public get timeline() {
        return this._timeline;
    }

    public initialisePointer(pointerId: string) {
        this.timeline.push({
            instructions: {
                targets: pointerId,
                opacity: 1,
            },
        });
    }

    public movePointerToNext(pointerId: string) {
        this.timeline.push({
            instructions: {
                targets: pointerId,
                translateX: `+=${nodePathWidth}`,
            },
        });
    }

    private resetPointers() {
        // Make disappear
        this.timeline.push({
            instructions: {
                targets: [CURRENT, PREV],
                opacity: 0,
            },
        });
        // Current arrow goes back to beginning
        this.timeline.push({
            instructions: {
                targets: [CURRENT, PREV],
                translateX: 0,
                duration: 1,
            },
        });
    }

    public resetList(list: LinkedList) {
        this.resetPointers();
        let curr: GraphicalLinkedListNode = list.head;
        let index: number = 0;
        while (curr != null) {
            this.timeline.push({
                instructions: {
                    targets: curr.nodeTarget,
                    top: 0,
                    left: index * nodePathWidth,
                },
                offset: '-=' + fastestDuration,
            });
            this.timeline.push({
                instructions: {
                    targets: curr.pointerTarget,
                    d: RIGHT_ARROW_PATH,
                },
                offset: '-=' + fastestDuration,
            });
            index++;
            curr = curr.next;
        }
    }
}
