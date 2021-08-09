
// Notes:

// Stepping feature could be implemented using animation.play() and pause()
// We can set anime property "autoplay" to false to play around with this property
// Could also do something with "complete" property which runs a function when an 
// animation is complete

import anime from 'animejs';


const initialise = () => {

    const canvas = document.querySelector("#canvas")
    const button = document.querySelector("#appendButton")
    const deleteButton = document.querySelector("#deleteButton")
    let nodes = []
    let id = 0

    function genid() {
        id += 1;
        return id;
    }


    function createNode(input) {
        const id = genid();
        let newNode = document.createElement("div");
        newNode.classList.add("node")
        newNode.setAttribute("id", `node-${id}`)
        newNode.innerHTML = input
        canvas.appendChild(newNode);
        return id;
    }


    function createSequence(input) {
        let currentTimeline = anime.timeline({
            duration: 250,
            easing: 'easeOutExpo'
        })
        currentTimeline.add({
            targets: `#node-${input}`,
            opacity: 1
        })
        currentTimeline.add({
            targets: "#current",
            opacity: 1
        })
        nodes.forEach((node, idx) => {
            currentTimeline.add({
                targets: "#current",
                translateX: idx * 100
            })
        })
        currentTimeline.add({
            targets: `#node-${input}`,
            translateX: (nodes.length - 3) * 100 - 40,
            translateY: 200
        })

        currentTimeline.add({
            targets: "#current",
            opacity: 0
        })
        currentTimeline.add({
            targets: "#current",
            translateX: 0
        })

    }

    function createDeleteNodeSequence(shiftedNodes, deletedNode, input) {
        let currentTimeline = anime.timeline({
            duration: 250,
            easing: 'easeOutExpo'
        })
        currentTimeline.add({
            targets: "#current",
            opacity: 1
        })
        for (let i = 0; i < input; i++) {
            currentTimeline.add({
                targets: "#current",
                translateX: i * 100
            })
        }
        const current = document.querySelector("#current")
        const deletedDOM = document.querySelector(`#node-${deletedNode.key}`)
        currentTimeline.add({
            targets: [current, deletedDOM],
            opacity: 0
        })
        const elements = shiftedNodes.map(node => {
            return `#node-${node.key}`
        })
        document.querySelectorAll(elements)
        currentTimeline.add({
            targets: elements,
            translateX: '-=100',
            complete: () => deleteNode(deletedNode)
        })
        currentTimeline.add({
            targets: "#current",
            translateX: 0
        })
    }

    function deleteNode(node) {
        const child = document.querySelector(`#node-${node.key}`)
        canvas.removeChild(child);
    }

    function handleClick(e) {
        e.preventDefault();
        const input = document.querySelector("#appendValue").value;
        const ref = createNode(input);
        nodes.push({ value: input, key: ref });
        createSequence(ref);
    }

    function handleDeleteClick(e) {
        e.preventDefault();
        const input = document.querySelector("#appendValue").value;
        const shiftedNodes = nodes.slice(input);
        const deletedNode = shiftedNodes.shift();
        nodes.splice(input, 1)
        createDeleteNodeSequence(shiftedNodes, deletedNode, input);
    }

    button.addEventListener('click', handleClick)
    deleteButton.addEventListener('click', handleDeleteClick)

    alert('Intialising');
}

export default initialise;
