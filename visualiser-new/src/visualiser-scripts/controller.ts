import { AnimeTimelineInstance } from 'animejs';
import createNode from './createNode';
import createSequence from './createSequence';
import runSequence from './runSequence';
import { Node, Animation } from './typedefs';

/**
 * Initialises the visualiser and binds event handlers to the controller UI.
 */
const initialise = (): void => {
    const nodes: Node[] = [];
    const animationHistory: AnimeTimelineInstance[] = [];

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
        const timeline = runSequence(sequence);
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

    // Grabbing references to form buttons and attaching event handlers to them
    const button = document.querySelector('#appendButton');
    const deleteButton = document.querySelector('#deleteButton');

    button.addEventListener('click', handleClick);
    deleteButton.addEventListener('click', handleDeleteClick);
};

export default initialise;
