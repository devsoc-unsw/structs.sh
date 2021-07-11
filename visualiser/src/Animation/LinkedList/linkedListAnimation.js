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

class LinkedListAnimation {
    constructor() {
        this.listData = {
            nodes: [],
            pointers: [],
            pointersGroup: document.querySelector(".visualiser-svg .pointers"),
            nodesGroup: document.querySelector(".visualiser-svg .nodes")
        }
        this.animationObj = new Animation();   // TODO: Inherit instead
        // Binding 'this' to methods
        this.animateAppend = this.animateAppend.bind(this);
        this.animateDelete = this.animateDelete.bind(this);
        this.handleAppend = this.handleAppend.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.createDefaultList = this.createDefaultList.bind(this);
        this.attachEventListeners = this.attachEventListeners.bind(this);

        this.createDefaultList();
        this.attachEventListeners();
    }

    /**
     * Executes the animation for appending a value to the linked list
     * @param data value of the node 
     */
    animateAppend(data) {
        appendNodeSVG(this.listData, data, false);
        if (this.listData.nodes.length > 1) appendPointerSVG(this.listData, false);
        const animationSequence = generateAppendSequence(this.listData);
        createAnimation(this.listData, animationSequence);
    }

    /**
     * Executes the animation for deleting a value to the linked list
     * @param position index of the value to delete
     */
    animateDelete(position) {
        const animationSequence = generateDeleteSequence(this.listData, position);
        createAnimation(this.listData, animationSequence);
        this.listData.nodes.splice(position, 1);
        this.listData.pointers.splice(0, 1);
    }

    handleAppend(e) {
        e.preventDefault();
        // stop any current animations
        // if (animation) {
        //     animation.seek(999999999999);
        //     animation = null;
        // }
        // if (!appendInput.value) {
        //     return;
        // }
        const fd = new FormData(e.target);
        const data = parseInt(fd.get("value"));
        console.log(`Attempting to append: ${data}`)
        this.animateAppend(data);
        // appendInput.value = '';
    }

    handleDelete(e) {
        e.preventDefault();
        // stop any current animations
        // if (animation) {
        //     animation.seek(999999999999);
        //     animation = null;
        // }
        // const position = parseInt(deleteInput.value);
        // if (0 <= position && position < nodes.length) {
        const fd = new FormData(e.target);
        const index = parseInt(fd.get("index"));
        console.log(`Attempting to delete: ${index}`)
        this.animateDelete(index);
        // }
        // deleteInput.value = '';
    }

    // adds some default values to the linked list
    createDefaultList() {
        appendPointerSVG(this.listData, true);
        appendPointerSVG(this.listData, true);
        appendNodeSVG(this.listData, 2, true);
        appendNodeSVG(this.listData, 4, true);
        appendNodeSVG(this.listData, 3, true);
    }

    attachEventListeners() {
        const appendForm = document.querySelector(".list-append-form");
        const deleteForm = document.querySelector(".list-delete-form");
        appendForm.addEventListener('submit', this.handleAppend);
        deleteForm.addEventListener('submit', this.handleDelete);
    }
}

export default LinkedListAnimation;
