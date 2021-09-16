import { AnimeTimelineInstance } from 'animejs';
import createNode from './createNode';
import createSequence from './createSequence';
import runSequence from './runSequence';
import { Node, Animation } from './typedefs';
import AnimationController from './genericController';

/**
 * Initialises the visualiser and binds event handlers to the controller UI.
 */
const initialise = (): void => {
    const nodes: Node[] = [];
    const animationHistory: AnimeTimelineInstance[] = [];
    const animationController = new AnimationController();

    // Binding event handlers to the append and delete buttons
    const handleClick: EventListener = (e: Event) => {
        e.preventDefault();

        // Extract the text input's number value
        const htmlInput = document.querySelector('#appendValue') as HTMLInputElement;
        const input: number = Number(htmlInput.value);

        const newNode = createNode(input);

        // Logic of action reflects the javascript implementation
        nodes.push(newNode);

        // Generating the steps of the animation
        const sequence: Animation[] = createSequence({ newNode, nodes }, 'append');

        // Playing the animation
        const timeline: AnimeTimelineInstance = runSequence(sequence);
        animationHistory.push(timeline);
    };

    const handleDeleteClick: EventListener = (e: Event) => {
        e.preventDefault();

        // TODO: The delete operation is taking the value from the input field with id #appendValue. This may be confusing
        const htmlInput = document.querySelector('#appendValue') as HTMLInputElement;
        const index: number = Number(htmlInput.value);

        // Finds the nodes that need to be shifted,
        const shiftedNodes = nodes.slice(index);
        const deletedNode = shiftedNodes.shift();

        // Deleted node at index input
        nodes.splice(index, 1);
        let prevNode = nodes[index];
        if (index !== 0) {
            prevNode = nodes[index - 1];
        }
        const sequence: Animation[] = createSequence(
            { index, deletedNode, shiftedNodes, prevNode },
            'deleteByIndex'
        );

        const timeline = runSequence(sequence);
        animationHistory.push(timeline);
    };

    const handlePlayClick: EventListener = (e: Event) => {
        e.preventDefault();
        animationController.play();
    };

    const handlePauseClick: EventListener = (e: Event) => {
        e.preventDefault();
        animationController.pause();
    };

    // Grabbing references to form buttons and attaching event handlers to them
    const appendButton = document.querySelector('#appendButton');
    const deleteButton = document.querySelector('#deleteButton');
    const playButton = document.querySelector('#playButton');
    const pauseButton = document.querySelector('#pauseButton');

    appendButton.addEventListener('click', handleAppendClick);
    deleteButton.addEventListener('click', handleDeleteClick);
    playButton.addEventListener('click', handlePlayClick);
    pauseButton.addEventListener('click', handlePauseClick);
};

export default initialise;
