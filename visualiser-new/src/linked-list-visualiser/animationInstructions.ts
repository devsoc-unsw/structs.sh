import { Animation, Node } from './typedefs';
import {
    RIGHT_ARROW_PATH,
    UP_ARROW_PATH,
    DOWN_RIGHT_ARROW_PATH,
    UP_RIGHT_ARROW_PATH,
    BENT_ARROW_PATH,
    actualNodeWidth,
    nodePathWidth,
    insertedNodeTopOffset,
    CURRENT,
    PREV,
    CANVAS
} from './svgAttributes';
import { fastestDuration } from './animationAttributes';
import LinkedList, { LinkedListNode } from './linkedList';


export default class AnimationInstructions {
    timeline: Animation[];
    constructor() {
        this.timeline = [];
    }

    getTimeline() {
        return this.timeline;
    }

    createNewNode(length: number, newNode: Node) {
        document.querySelector(CANVAS).appendChild(newNode.nodeTarget);
        this.timeline.push({
            targets: newNode.nodeTarget,
            left: (length - 1) * nodePathWidth,
            opacity: 1,
            duration: 1,
        })
    }
    
    createNodeAt(index: number, newNode: Node) {
        document.querySelector(CANVAS).appendChild(newNode.nodeTarget);
        this.timeline.push({
            targets: newNode.nodeTarget,
            left: index * nodePathWidth + actualNodeWidth,
            top: insertedNodeTopOffset,
            opacity: 1,
            duration: 1
        })
    }

    initialisePointer(pointerTarget: string) {
        this.timeline.push({
            targets: pointerTarget,
            opacity: 1
        })
    }
    
    moveToNext(pointerTarget: string) {
        this.timeline.push({
            targets: pointerTarget,
            translateX: `+=${nodePathWidth}`
        });
    }

    linkLastToNew(curr: LinkedListNode) {
        this.timeline.push({
            targets: curr.node.pointerTarget,
            opacity: 1
        })
    }

    setPointerToNull(node: LinkedListNode) {
        this.timeline.push({
            targets: node.node.pointerTarget,
            opacity: 0
        })
    }

    morphPointer(node: LinkedListNode) {
        this.timeline.push({
            targets: node.node.pointerTarget,
            d: [
                { value: RIGHT_ARROW_PATH },
                { value: BENT_ARROW_PATH }
            ]
        })
    }

    deleteNode(node: LinkedListNode) {
        this.timeline.push({
            targets: [node.node.pointerTarget, node.node.nodeTarget],
            opacity: 0
        });
    }

    indicateFound(curr: LinkedListNode) {
        this.timeline.push({
            targets: [curr.node.nodeBoxTarget],
            fill: [
                { value: '#46B493', duration: 700},
                { value: '#000000', duration: 300}
            ],
            stroke: [
                { value: '#46B493', duration: 700},
                { value: '#000000', duration: 300}
            ]
        })
    }

    resetPointers() {
        // Make curr disappear
        this.timeline.push({
            targets: [ CURRENT, PREV ],
            opacity: 0
        })
        // Current arrow goes back to beginning
        this.timeline.push({
            targets: [ CURRENT, PREV ],
            translateX: 0,
            duration: 1 
        }) 
    }
    
    resetDelete(prev: LinkedListNode, curr: LinkedListNode) {
        this.resetPointers();
        // If deleting node after first, revert bendy arrow back to
        // straight arrow.
        if (prev !== null) {
            this.timeline.push({
                targets: prev.node.pointerTarget,
                d: [
                    { value: BENT_ARROW_PATH },
                    { value: RIGHT_ARROW_PATH }
                ],
            })
        }
        // Shift nodes back into place.
        const shiftedNodes = [];
        let ptr = curr.next;
        while (ptr) {
            shiftedNodes.push(ptr.node.nodeTarget);
            ptr = ptr.next;
        }
        this.timeline.push({
            // targets: shiftedNodes.map(n => n.nodeTarget),
            targets: shiftedNodes,
            translateX: `-=${nodePathWidth}`,
            // hardcoded offset to make the nodes shift back at the 
            // same time as the pointer straightening.
            offset: "-=" + fastestDuration / 2
        })

    }
    insertedNodePointToNext(newNode: Node) {
        this.timeline.push({
            targets: newNode.pointerTarget,
            d: UP_RIGHT_ARROW_PATH,
            duration: 1
        })
        this.timeline.push({
            targets: newNode.pointerTarget,
            opacity: 1
        })
    }

    pointToInsertedNode(node: Node) {
        this.timeline.push({
            targets: node.pointerTarget,
            d: DOWN_RIGHT_ARROW_PATH
        })
    }

    resetList(list: LinkedList) {
        this.resetPointers();
        this.timeline.push({
            targets: list.head.node.nodeTarget,
            top: 0,
        });
        this.timeline.push({
            targets: list.head.node.pointerTarget,
            offset: '-=' + fastestDuration,
            d: RIGHT_ARROW_PATH
        });
        let curr = list.head.next;
        let index = 1;
        while (curr != null) {
            console.log(curr.node.value);
            this.timeline.push({
                targets: curr.node.nodeTarget,
                offset: '-=' + fastestDuration,
                top: 0,
                left: index * nodePathWidth
            });
            this.timeline.push({
                targets: curr.node.pointerTarget,
                offset: '-=' + fastestDuration,
                d: RIGHT_ARROW_PATH
            });
            index++;
            curr = curr.next;
        }
    }
}