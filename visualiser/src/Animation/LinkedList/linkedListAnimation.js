import Animation from '../Animation';
import {
    createAnimation
} from './utils/linkedListLookupUtil';
import {
    appendNodeSVG,
    appendPointerSVG,
} from './utils/linkedListDrawingUtil';
import {
    generateAppendSequence,
    generateDeleteSequence,
} from './utils/linkedListAnimationUtil';

class LinkedListAnimation extends Animation {
    /**
     * Initiates a linkedListAnimation instance.
     * @param {node} pointersGroupRef Reference to the DOM element where the arrows are placed.
     * @param {node} nodesGroupRef Reference to the DOM element where the nodes are placed.
     */
    constructor(defaultValues, pointersGroupRef, nodesGroupRef) {
        super();
        this.listData = {
            nodes: [],
            pointers: [],
            pointersGroup: pointersGroupRef,
            nodesGroup: nodesGroupRef,
        }
        this.createDefaultList(defaultValues);
    }

    /**
     * Executes the animation for appending a value to the linked list
     * @param data value of the node 
     */
    animateAppend = (data) => {
        appendNodeSVG(this.listData, data, false);
        if (this.listData.nodes.length > 1) appendPointerSVG(this.listData, false);
        const animationSequence = generateAppendSequence(this.listData);
        createAnimation(this.listData, animationSequence);
    }

    /**
     * Executes the animation for deleting a value to the linked list
     * @param position index of the value to delete
     */
    animateDelete = (position) => {
        const animationSequence = generateDeleteSequence(this.listData, position);
        createAnimation(this.listData, animationSequence);
        this.listData.nodes.splice(position, 1);
        this.listData.pointers.splice(0, 1);
    }

    // adds some default values to the linked list
    createDefaultList = (values) => {
        values.forEach((v, i) => {
            i > 0 && appendPointerSVG(this.listData, true);
            appendNodeSVG(this.listData, v, true);
        });
    }
}

export default LinkedListAnimation;