import { Node } from './util/typedefs';
import anime from 'animejs';
import BST from './data-structure/GraphicalBST';
import { create } from 'domain';
import { Timeline } from '@svgdotjs/svg.js';
import AnimationController from '../new-controller/genericController'; 

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
    const controller: AnimationController = new AnimationController();

    const handleInsertClick: EventListener = (e: Event) => {
        e.preventDefault();

        // if a timeline is currently running on the controller then finish it and start the new insert timeline
        controller.finish();
        
        // this returned timeline value will eventually be used by the animation controller
        const timeline: Timeline = bst.insert(Number(inputValue.value));
        controller.setCurrentTimeline(timeline);
    }

    const handlePlayClick: EventListener = (e: Event) => {
        e.preventDefault();

        controller.play();
    }

    const handlePauseClick: EventListener = (e: Event) => {
        e.preventDefault();

        controller.pause();
    }
    
    const insertButton = document.querySelector('#insertButton');
    const playButton = document.querySelector('#playButton');
    const pauseButton = document.querySelector('#pauseButton');
    
    insertButton.addEventListener('click', handleInsertClick);
    playButton.addEventListener('click', handlePlayClick);
    pauseButton.addEventListener('click', handlePauseClick);
};

export default initialise;
