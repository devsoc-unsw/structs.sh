import createNode from './createNode'
import createSequence from './createSequence'
import runSequence from './runSequence'



const initialise = () => {

    const button = document.querySelector("#appendButton")
    // const deleteButton = document.querySelector("#deleteButton")
    const nodes = []
    const animationHistory = []


    // Node Structure:
    // {
    //     id: Number,
    //     nodeTaget: String,
    //     pathTarget: String
    // }

    async function handleClick(e) {
        e.preventDefault();
        const input = document.querySelector("#appendValue").value;
        const newNode = createNode(input);
        nodes.push(newNode);

        const sequence = createSequence(newNode, nodes, 'append');
        console.log(sequence)

        const timeline = await runSequence(sequence)
        animationHistory.push(timeline)
    }

    // function handleDeleteClick(e) {
    //     e.preventDefault();
    //     const input = document.querySelector("#appendValue").value;
    //     const shiftedNodes = nodes.slice(input);
    //     const deletedNode = shiftedNodes.shift();
    //     nodes.splice(input, 1)
    //     createDeleteNodeSequence(shiftedNodes, deletedNode, input);
    // }

    // function deleteNode(node) {
    //     const child = document.querySelector(`#node-${node.key}`)
    //     canvas.removeChild(child);
    // }

    button.addEventListener('click', handleClick)
    // deleteButton.addEventListener('click', handleDeleteClick)

}

export default initialise;
