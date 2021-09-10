// TODO: Controller tasks:
//   1. Add some basic buttons for play/pause, step forward/backward, etc. in App.tsx (we'll eventually use Rachel's styled controller menu when we develop this prototype more)
//   2. Add event handlers for play/pause, step forward/backward, etc. in controller.js 
//   3. Implement play/pause event handlers
//   4. (Try) Implement step forward and backward
//   5. (Try) Implement reverse
// Feel free to develop this however you think is best! Add more files, break down the `initialise` function, etc.

import createNode from './createNode'
import createSequence from './createSequence'
import runSequence from './runSequence'

/**
 * Initialises the visualiser and binds event handlers to the controller UI.
 */
const initialise = () => {
    const nodes = []
    const animationHistory = []
    // Node Structure:
    // {
    //     id: Number,
    //     nodeTaget: String,
    //     pathTarget: String
    // }

    // Binding event handles to the append and delete buttons
    const handleClick = (e) => {
        e.preventDefault();

        // Extract the text input's number value
        const input = document.querySelector("#appendValue").value;

        // 
        const newNode = createNode(input);

        // Logic of action reflects the javascript implementation
        nodes.push(newNode);
        console.log(nodes);
        // Generating the steps of the animation
        const sequence = createSequence({ newNode, nodes }, 'append');

        // Playing the animation
        const timeline = runSequence(sequence)
        animationHistory.push(timeline)
    }

    const handleDeleteClick = (e) => {
        e.preventDefault();
        const index = document.querySelector("#appendValue").value;

        // Finds the nodes that need to be shifted, 
        const shiftedNodes = nodes.slice(index);
        const deletedNode = shiftedNodes.shift();

        // Deleted node at index input
        nodes.splice(index, 1)
        let prevNode = nodes[index]
        if (index !== 0) {
            prevNode = nodes[index - 1]
        }
        const sequence = createSequence({ index, deletedNode, shiftedNodes, prevNode }, "deleteByIndex")
        console.log(sequence)

        const timeline = runSequence(sequence)
        animationHistory.push(timeline)
    }

    // Grabbing references to form buttons and attaching event handlers to them
    const button = document.querySelector("#appendButton")
    const deleteButton = document.querySelector("#deleteButton")

    button.addEventListener('click', handleClick)
    deleteButton.addEventListener('click', handleDeleteClick)

}

export default initialise;
