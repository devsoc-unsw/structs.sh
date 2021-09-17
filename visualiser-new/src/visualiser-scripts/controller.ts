import createNode from './createNode';
import createSequence from './createSequence';
import AnimationController from './genericController';
import { Animation, Node } from './typedefs';

/**
 * Initialises the visualiser and binds event handlers to the controller UI.
 */
const initialise = (): void => {
    const nodes: Node[] = [];
    const animationController = new AnimationController();

    // Binding event handlers to the append and delete buttons
    const handleAppendClick: EventListener = (e: Event) => {
        e.preventDefault();
        const currentTimeline = animationController.getCurrentTimeline();
        currentTimeline.seek(currentTimeline.duration);
        // Extract the text input's number value
        const htmlInput = document.querySelector('#appendValue') as HTMLInputElement;
        const input: number = Number(htmlInput.value);

        const newNode = createNode(input);

        // Logic of action reflects the javascript implementation
        nodes.push(newNode);

        // Generating the steps of the animation
        const sequence: Animation[] = createSequence({ newNode, nodes }, 'append');

        // Playing the animation
        animationController.runSequence(sequence);
    };

    const handleDeleteClick: EventListener = (e: Event) => {
        e.preventDefault();
        const currentTimeline = animationController.getCurrentTimeline();
        currentTimeline.seek(currentTimeline.duration);

        // TODO: The delete operation is taking the value from the input field with id #appendValue. This may be confusing
        const htmlInput = document.querySelector('#appendValue') as HTMLInputElement;
        const index: number = Number(htmlInput.value);

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
        animationController.runSequence(sequence);
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
