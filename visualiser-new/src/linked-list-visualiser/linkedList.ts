import { Node } from './typedefs';
import {
    CURRENT,
    PREV
} from './svgAttributes';
import AnimationInstructions from './animationInstructions';
import createNode from './createNode';
import { createFunctionDeclaration } from 'typescript';

export class LinkedListNode {
    node: Node;
    next: LinkedListNode;
    constructor(node: Node) {
        this.node = node;
        this.next = null;
    }
}

export default class LinkedList {
    head: LinkedListNode;
    length: number;
    constructor() {
        this.head = null;
        this.length = 0;
    }

    append(input: number) {
        this.length++;
        const instructions = new AnimationInstructions();
        // Create new node
        const newNode = createNode(input);
        const newLinkedListNode = new LinkedListNode(newNode);
        instructions.createNewNode(this.length, newNode);

        // Account for case when list is empty
        if (this.head === null) {
            this.head = newLinkedListNode;
            return instructions.getTimeline();
        }
        
        // Initialise curr
        let curr = this.head;
        instructions.initialisePointer(CURRENT);
        
        // Traverse to last node
        while (curr.next !== null) {
            curr = curr.next;
            instructions.moveToNext(CURRENT);
        }
        
        // Link last node to new node
        curr.next = newLinkedListNode;
        instructions.linkLastToNew(curr);

        // Reset positions
        instructions.resetPointers();
        return instructions.getTimeline();
    }

    delete(index: number) {
        if (index < 0 || index > this.length - 1) return [];
        this.length--;
        const instructions = new AnimationInstructions();
        let curr = this.head;
        instructions.initialisePointer(CURRENT);
        let prev = null;
        for (let i = 0; i < index; i++) {
            prev = curr;
            if (prev === this.head) {
                instructions.initialisePointer(PREV);
            } else {
                instructions.moveToNext(PREV);
            }
            curr = curr.next;
            instructions.moveToNext(CURRENT);
        }
        if (prev !== null) {
            prev.next = curr.next;
            if (prev.next === null) {
                instructions.setPointerToNull(prev)
            } else {
                instructions.morphPointer(prev);
            }
        }
        instructions.deleteNode(curr);
        instructions.resetDelete(prev, curr);
        return instructions.getTimeline();
    }

    search(value: number) {
        if (this.head === null) {
            return [];
        }
        const instructions = new AnimationInstructions();
        let curr = this.head;
        instructions.initialisePointer(CURRENT);
        while (curr !== null && curr.node.value !== value) {
            curr = curr.next;
            if (curr !== null) {
                instructions.moveToNext(CURRENT);
            }
        }
        if (curr !== null) {
            instructions.indicateFound(curr);
        }
        instructions.resetPointers();
        return instructions.getTimeline();
    }

    insert(value: number, index: number) {
        if (index > this.length - 1) {
            return this.append(value);
        }
        this.length++;
        const instructions: AnimationInstructions = new AnimationInstructions();
        const newNode = createNode(value);
        const newLinkedListNode = new LinkedListNode(newNode);
        instructions.createNodeAt(index, newNode);
        let curr = this.head;
        instructions.initialisePointer(CURRENT);
        for (let i = 0; i < index; i++) {
            curr = curr.next;
            instructions.moveToNext(CURRENT);
        }
        newLinkedListNode.next = curr.next;
        instructions.insertedNodePointToNext(newNode); 
        curr.next = newLinkedListNode;
        instructions.pointToInsertedNode(curr.node)
        
        instructions.resetList(this);
        return instructions.getTimeline();
    }
}
