import { AnimationInstruction } from '../util/typedefs';
import {
    RIGHT_ARROW_PATH,
    topOffset,
    nodePathWidth,
    fastestDuration,
    CURRENT,
    PREV,
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
                translateY: topOffset,
                duration: 1
            },
        });
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
                translateY: topOffset
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
        // Arrow goes back to beginning
        this.timeline.push({
            instructions: {
                targets: [CURRENT, PREV],
                translateX: 0,
                translateY: topOffset,
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
                    translateX: index * nodePathWidth,
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
