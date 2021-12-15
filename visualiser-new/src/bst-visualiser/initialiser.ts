import { Node } from './util/typedefs';
import anime from 'animejs';
import BST from './data-structure/GraphicalBST';
import { create } from 'domain';
import { Timeline } from '@svgdotjs/svg.js';

/**
 * Initialises the visualiser and binds event handlers to the controller UI.
 */

/**
 * Structure:
 * . BST class which stores the underlying bst and handles svg manipulation and animation
 * . references to html elements which have event listeners to call methods from the bst class
 */
const initialise = (): void => {
    const bst: BST = new BST();
    const inputValue: HTMLInputElement = document.querySelector('#inputValue');

    const handleInsertClick: EventListener = (e: Event) => {
        e.preventDefault();
        
        // this returned timeline value will eventually be used by the animation controller
        const timeline: Timeline = bst.insert(Number(inputValue.value));
    }
    
    const insertButton = document.querySelector('#insertButton');
    
    insertButton.addEventListener('click', handleInsertClick);
};

export default initialise;
