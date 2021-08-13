import createNode from './createNode'
import createSequence from './createSequence'
import runSequence from './runSequence'



const initialise = () => {

    const button = document.querySelector("#appendButton")
    const deleteButton = document.querySelector("#deleteButton")
    const nodes = []
    const animationHistory = []


    // Node Structure:
    // {
    //     id: Number,
    //     nodeTaget: String,
    //     pathTarget: String
    // }

    function handleClick(e) {
        e.preventDefault();
        const input = document.querySelector("#appendValue").value;
        const newNode = createNode(input);
        // Logic of action reflects the javascript implementation
        nodes.push(newNode);

        const sequence = createSequence({newNode, nodes}, 'append');

        const timeline = runSequence(sequence)
        animationHistory.push(timeline)
    }

    function handleDeleteClick(e) {
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
        const sequence = createSequence({index, deletedNode, shiftedNodes, prevNode}, "deleteByIndex")
        console.log(sequence)

        const timeline = runSequence(sequence)
        animationHistory.push(timeline)
    }

    // function deleteNode(node) {
    //     const child = document.querySelector(`#node-${node.key}`)
    //     canvas.removeChild(child);
    // }

    button.addEventListener('click', handleClick)
    deleteButton.addEventListener('click', handleDeleteClick)

}

export default initialise;
