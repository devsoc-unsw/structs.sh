import BST from './data-structure/GraphicalBST';
import AnimationController from '../new-controller/genericController'; 
import { Animation } from './util/typedefs';

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
        const a: Animation[] = bst.insert(5);
        controller.constructTimeline(a);

        const b: Animation[] = bst.insert(3);
        controller.constructTimeline(b);

        const c: Animation[] = bst.insert(2);
        controller.constructTimeline(c);

        const d: Animation[] = bst.insert(4);
        controller.constructTimeline(d);

        const f: Animation[] = bst.insert(6);
        controller.constructTimeline(f);
    }

    const handleRotateRightClick: EventListener = (e: Event) => {
        e.preventDefault();

        // if a timeline is currently running on the controller then finish it and start the new insert timeline
        controller.finish();
        
        // this returned timeline value will eventually be used by the animation controller
        const animationSequence: Animation[] = bst.rotateRight(Number(inputValue.value));
        controller.constructTimeline(animationSequence);
    }

    const handlePlayClick: EventListener = (e: Event) => {
        e.preventDefault();

        controller.play();
    }

    const handlePauseClick: EventListener = (e: Event) => {
        e.preventDefault();

        controller.pause();
    }

    const handleRestartClick: EventListener = (e: Event) => {
        e.preventDefault();

        controller.seekPercent(0);
        controller.play();
    }

    const handleTimelineSliderChange: EventListener = (e: Event) => {
        // the timeline can only be seeked when it's paused
        controller.pause();
        controller.seekPercent(Number(timelineSlider.value));
    };

    const handleSpeedSliderChange: EventListener = (e: Event) => {
        controller.pause();
        controller.setSpeed(Number(speedSlider.value));
        controller.play();
    };

    const handleStepBackwardsClick: EventListener = (e: Event) => {
        e.preventDefault();

        controller.pause();
        controller.stepBackwards();
    };

    const handleStepForwardsClick: EventListener = (e: Event) => {
        e.preventDefault();

        controller.pause();
        controller.stepForwards();
    };
    
    const insertButton = document.querySelector('#insertButton');
    const rotateRightButton = document.querySelector('#rotateRightButton');
    const playButton = document.querySelector('#playButton');
    const pauseButton = document.querySelector('#pauseButton');
    const restartButton = document.querySelector('#restartButton');
    const timelineSlider = document.querySelector('#timelineSlider') as HTMLInputElement;
    const speedSlider = document.querySelector('#speedSlider') as HTMLInputElement;
    const stepBackwardsButton = document.querySelector('#stepBackwardsButton');
    const stepForwardsButton = document.querySelector('#stepForwardsButton');
    
    insertButton.addEventListener('click', handleInsertClick);
    rotateRightButton.addEventListener('click', handleRotateRightClick);
    playButton.addEventListener('click', handlePlayClick);
    pauseButton.addEventListener('click', handlePauseClick);
    restartButton.addEventListener('click', handleRestartClick);
    timelineSlider.addEventListener('input', handleTimelineSliderChange);
    speedSlider.addEventListener('input', handleSpeedSliderChange);
    stepBackwardsButton.addEventListener('click', handleStepBackwardsClick);
    stepForwardsButton.addEventListener('click', handleStepForwardsClick);
};

export default initialise;
