import LinkedListController from '../controller/linkedListController';
import { AnimationInstruction } from './util/typedefs';
import LinkedList from './data-structure/GraphicalLinkedList';
import { defaultSpeed } from './util/constants';

/**
 * Initialises the visualiser and binds event handlers to the controller UI.
 */
const initialiser = (): void => {
    const linkedList: LinkedList = new LinkedList();
    const animationController = new LinkedListController();
    animationController.setSpeed(defaultSpeed);

    // Binding event handlers to the append and delete buttons
    const handleAppendClick: EventListener = (e: Event) => {
        e.preventDefault();
        animationController.finish();

        // Generating the steps of the animation
        const sequence: AnimationInstruction[] = linkedList.append(animationController.inputValue);

        // Playing the animation
        animationController.runSequence(sequence, slider);
    };

    const handleDeleteClick: EventListener = (e: Event) => {
        e.preventDefault();
        animationController.finish();
        const index: number = animationController.inputValue;

        const sequence: AnimationInstruction[] = linkedList.delete(index);

        animationController.runSequence(sequence, slider);
    };

    const handleSearchClick: EventListener = (e: Event) => {
        e.preventDefault();
        animationController.finish();
        const input: number = animationController.inputValue;

        const sequence: AnimationInstruction[] = linkedList.search(input);

        animationController.runSequence(sequence, slider);
    };

    const handleInsertClick: EventListener = (e: Event) => {
        e.preventDefault();
        animationController.finish();
        const input: number = animationController.inputValue;
        const index: number = animationController.altInputValue;

        const sequence: AnimationInstruction[] = linkedList.insert(input, index);

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

    const handleSelectPrevious: EventListener = (e: Event) => {
        e.preventDefault();
        animationController.gotoPrevious();
    }

    const handleSelectNext: EventListener = (e: Event) => {
        e.preventDefault();
        animationController.gotoNext();
    }

    const handleSliderChange: EventListener = (e: Event) => {
        // the timeline can only be seeked when it's paused
        animationController.pause();
        animationController.seekPercent(parseInt(slider.value));
    };

    const handleSpeedChange: EventListener = (e: Event) => {
        animationController.freeze();
        animationController.setSpeed(parseFloat(speedSlider.value));
    };

    const handleSpeedChangeComplete: EventListener = (e: Event) => {
        if (!animationController.isPaused) animationController.play();
    };

    // Grabbing references to form buttons and attaching event handlers to them
    const appendButton = document.querySelector('#appendButton');
    const deleteButton = document.querySelector('#deleteButton');
    const searchButton = document.querySelector('#searchButton');
    const playButton = document.querySelector('#playButton');
    const pauseButton = document.querySelector('#pauseButton');
    const insertButton = document.querySelector('#insertButton');
    const previousButton = document.querySelector('#previousSequenceButton');
    const nextButton = document.querySelector('#nextSequenceButton');
    const slider = document.querySelector('#timeline-slider') as HTMLInputElement;
    const speedSlider = document.querySelector('#speed-slider') as HTMLInputElement;

    appendButton.addEventListener('click', handleAppendClick);
    deleteButton.addEventListener('click', handleDeleteClick);
    searchButton.addEventListener('click', handleSearchClick);
    insertButton.addEventListener('click', handleInsertClick);
    playButton.addEventListener('click', handlePlayClick);
    pauseButton.addEventListener('click', handlePauseClick);
    previousButton.addEventListener('click', handleSelectPrevious);
    nextButton.addEventListener('click', handleSelectNext);
    slider.addEventListener('input', handleSliderChange);
    speedSlider.addEventListener('input', handleSpeedChange);
    speedSlider.addEventListener('change', handleSpeedChangeComplete);
};

export default initialiser;
