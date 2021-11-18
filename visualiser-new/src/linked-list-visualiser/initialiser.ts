import createNode from './createNode';
import LinkedListController from '../controller/linkedListController';
import { Animation, Node } from './typedefs';
import LinkedList from './linkedList';
import { Z_BEST_SPEED } from 'zlib';

/**
 * Initialises the visualiser and binds event handlers to the controller UI.
 */
const initialiser = (): void => {
    // const nodes: LinkedList = [];
    const linkedList: LinkedList = new LinkedList();
    const animationController = new LinkedListController();

    // Binding event handlers to the append and delete buttons
    const handleAppendClick: EventListener = (e: Event) => {
        e.preventDefault();
        animationController.finish();

        // Generating the steps of the animation
        const sequence: Animation[] = linkedList.append(animationController.inputValue);

        // Playing the animation
        animationController.runSequence(sequence, slider);
    };

    const handleDeleteClick: EventListener = (e: Event) => {
        e.preventDefault();
        animationController.finish();
        const index: number = animationController.inputValue;

        const sequence: Animation[] = linkedList.delete(index);

        animationController.runSequence(sequence, slider);
    };

    const handleSearchClick: EventListener = (e: Event) => {
        e.preventDefault();
        animationController.finish();
        const input: number = animationController.inputValue;

        const sequence: Animation[] = linkedList.search(input);

        animationController.runSequence(sequence, slider);
    };

    const handleInsertClick: EventListener = (e: Event) => {
        e.preventDefault();
        animationController.finish();
        const input: number = animationController.inputValue;
        const index: number = animationController.altInputValue;

        const sequence: Animation[] = linkedList.insert(input, index);

        animationController.runSequence(sequence, slider);
    }

    const handlePlayClick: EventListener = (e: Event) => {
        e.preventDefault();
        animationController.play();
    };

    const handlePauseClick: EventListener = (e: Event) => {
        e.preventDefault();
        animationController.pause();
    };

    const handleSliderChange: EventListener = (e: Event) => {
        animationController.seek(parseInt(slider.value));
    };

    const handleSpeedChange: EventListener = (e: Event) => {
        animationController.freeze();
        animationController.setSpeed(parseFloat(speedSlider.value));
    };

    const handleSpeedChangeComplete: EventListener = (e: Event) => {
        console.log("Done");
        if (!animationController.isPaused) animationController.play();
    };

    // Grabbing references to form buttons and attaching event handlers to them
    const appendButton = document.querySelector('#appendButton');
    const deleteButton = document.querySelector('#deleteButton');
    const searchButton = document.querySelector('#searchButton');
    const playButton = document.querySelector('#playButton');
    const pauseButton = document.querySelector('#pauseButton');
    const insertButton = document.querySelector('#insertButton');
    const slider = document.querySelector('#timeline-slider') as HTMLInputElement;
    const speedSlider = document.querySelector('#speed-slider') as HTMLInputElement;

    appendButton.addEventListener('click', handleAppendClick);
    deleteButton.addEventListener('click', handleDeleteClick);
    searchButton.addEventListener('click', handleSearchClick);
    insertButton.addEventListener('click', handleInsertClick);
    playButton.addEventListener('click', handlePlayClick);
    pauseButton.addEventListener('click', handlePauseClick);
    slider.addEventListener('input', handleSliderChange);
    speedSlider.addEventListener('input', handleSpeedChange);
    speedSlider.addEventListener('change', handleSpeedChangeComplete);
};

export default initialiser;
