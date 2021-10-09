import createNode from './createNode';
import createSequence from './createSequence';
import LinkedListController from '../controller/linkedListController';
import { Animation, Node } from './typedefs';

/**
 * Initialises the visualiser and binds event handlers to the controller UI.
 */
const initialise = (): void => {
    const nodes: Node[] = [];
    const animationController = new LinkedListController();

    // Binding event handlers to the append and delete buttons
    const handleAppendClick: EventListener = (e: Event) => {
        e.preventDefault();
        animationController.finish();

        const newNode = createNode(animationController.inputValue);

        // Logic of action reflects the javascript implementation
        nodes.push(newNode);

        // Generating the steps of the animation
        const sequence: Animation[] = createSequence({ newNode, nodes }, 'append');

        // Playing the animation
        animationController.runSequeuce(sequence, slider);
    };

    const handleDeleteClick: EventListener = (e: Event) => {
        e.preventDefault();
        animationController.finish();

        const index: number = animationController.inputValue;

        // Finds the nodes that need to be shifted,
        const shiftedNodes = nodes.slice(index);
        const deletedNode = shiftedNodes.shift();

        // Deleted node at index input
        let prevNode = nodes[index];
        if (index !== 0) {
            prevNode = nodes[index - 1];
        }
        const sequence: Animation[] = createSequence(
            { index, deletedNode, shiftedNodes, prevNode, nodes },
            'deleteByIndex'
        );
        nodes.splice(index, 1);
        animationController.runSequeuce(sequence, slider);
    };

    const handleSearchClick: EventListener = (e: Event) => {

    };

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

    const handleSliderChange: EventListener = (e: Event) => {
        animationController.seekPercent(parseInt(slider.value));
    };
    // Grabbing references to form buttons and attaching event handlers to them
    const appendButton = document.querySelector('#appendButton');
    const deleteButton = document.querySelector('#deleteButton');
    const searchButton = document.querySelector('#searchButton');
    const playButton = document.querySelector('#playButton');
    const pauseButton = document.querySelector('#pauseButton');
    const previousButton = document.querySelector('#previousSequenceButton');
    const slider = document.querySelector('#timeline-slider') as HTMLInputElement;

    appendButton.addEventListener('click', handleAppendClick);
    deleteButton.addEventListener('click', handleDeleteClick);
    searchButton.addEventListener('click', handleSearchClick);
    playButton.addEventListener('click', handlePlayClick);
    pauseButton.addEventListener('click', handlePauseClick);
    previousButton.addEventListener('click', handleSelectPrevious);
    slider.addEventListener('input', handleSliderChange);
};

export default initialise;
