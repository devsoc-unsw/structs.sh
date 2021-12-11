import { AnimationInstruction } from './util/typedefs';
import {
    RIGHT_ARROW_PATH,
    UP_ARROW_PATH,
    DOWN_RIGHT_ARROW_PATH,
    UP_RIGHT_ARROW_PATH,
    BENT_ARROW_PATH,
    actualNodeWidth,
    nodePathWidth,
    insertedNodeTopOffset,
    fastestDuration,
    CURRENT,
    PREV,
    CANVAS
} from './util/constants';
import LinkedList from './data-structure/GraphicalLinkedList';
import { GraphicalLinkedListNode } from './data-structure/GraphicalLinkedListNode';


export class LinkedListAnimationProducer {
    private _timeline: AnimationInstruction[] = [];

    public get timeline() {
        return this._timeline;
    }

    addNodeAtEnd(length: number, newNode: GraphicalLinkedListNode) {
        document.querySelector(CANVAS).appendChild(newNode.nodeTarget);
        console.log("Hi");
        this._timeline.push({
            instructions: {
                targets: newNode.nodeTarget,
                left: (length - 1) * nodePathWidth,
                opacity: 1,
                duration: 1,
            }
        })
    }
    
    createNodeAt(index: number, newNode: GraphicalLinkedListNode) {
        document.querySelector(CANVAS).appendChild(newNode.nodeTarget);
        this._timeline.push({
            instructions: {
                targets: newNode.nodeTarget,
                left: index * nodePathWidth + actualNodeWidth,
                top: insertedNodeTopOffset,
                opacity: 1,
                duration: 1
            }
        })
    }

    initialisePointer(pointerTarget: string) {
        this._timeline.push({
            instructions: {
                targets: pointerTarget,
                opacity: 1
            }
        })
    }
    
    moveToNext(pointerTarget: string) {
        this._timeline.push({
            instructions: {
                targets: pointerTarget,
                translateX: `+=${nodePathWidth}`
            }
        });
    }

    linkLastToNew(last: GraphicalLinkedListNode) {
        this._timeline.push({
            instructions: {
                targets: last.pointerTarget,
                opacity: 1
            }
        })
    }

    setPointerToNull(node: GraphicalLinkedListNode) {
        this._timeline.push({
            instructions: {
                targets: node.pointerTarget,
                opacity: 0
            }
        })
    }

    morphPointer(node: GraphicalLinkedListNode) {
        this._timeline.push({
            instructions: {
                targets: node.pointerTarget,
                d: [
                    { value: RIGHT_ARROW_PATH },
                    { value: BENT_ARROW_PATH }
                ]
            }
        })
    }

    deleteNode(node: GraphicalLinkedListNode) {
        this._timeline.push({
            instructions: {
                targets: [node.pointerTarget, node.nodeTarget],
                opacity: 0
            }
        });
    }

    indicateFound(node: GraphicalLinkedListNode) {
        this._timeline.push({
            instructions: {
                targets: [node.boxTarget, node.numberTarget],
                stroke: [
                    { value: '#46B493', duration: 700},
                    { value: '#000000', duration: 300}
                ]
            }
        })
    }

    resetPointers() {
        // Make curr disappear
        this._timeline.push({
            instructions: {
                targets: [ CURRENT, PREV ],
                opacity: 0
            }
        })
        // Current arrow goes back to beginning
        this._timeline.push({
            instructions: {
                targets: [ CURRENT, PREV ],
                translateX: 0,
                duration: 1 
            }
        }) 
    }

    insertedNodePointToNext(newNode: GraphicalLinkedListNode) {
        this._timeline.push({
            instructions: {
                targets: newNode.pointerTarget,
                d: UP_RIGHT_ARROW_PATH,
                duration: 1
            }
        })
        this._timeline.push({
            instructions: {
                targets: newNode.pointerTarget,
                opacity: 1
            }
        })
    }

    pointToInsertedNode(node: GraphicalLinkedListNode) {
        this._timeline.push({
            instructions: {
                targets: node.pointerTarget,
                d: DOWN_RIGHT_ARROW_PATH
            }
        })
    }

    resetList(list: LinkedList) {
        this.resetPointers();
        let curr = list.head;
        let index = 0;
        while (curr != null) {
            this._timeline.push({
                instructions: {
                    targets: curr.nodeTarget,
                    top: 0,
                    left: index * nodePathWidth
                },
                offset: '-=' + fastestDuration,
            });
            this._timeline.push({
                instructions: {
                    targets: curr.pointerTarget,
                    d: RIGHT_ARROW_PATH
                },
                offset: '-=' + fastestDuration
            });
            index++;
            curr = curr.next;
        }
    }
}