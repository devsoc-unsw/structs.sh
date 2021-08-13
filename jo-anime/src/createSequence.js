
const CURRENT = "#current"

// Node Structure:
// {
//     id: Number,
//     nodeTaget: String,
//     pathTarget: String
// }

function createSequence(newNode, nodes, type) {

    const timeline = []
    if (type === 'append') {
        // newNode appears
        timeline.push({
            targets: "#" + newNode.nodeTarget,
            opacity: 1
        })
        // Current pointer appears
        timeline.push({
            targets: CURRENT,
            opacity: 1
        })
        // Current pointer moves into position
        for (const node in nodes) {
            timeline.push({
                targets: CURRENT,
                translateX: node * 100
            })
        }
        // newNode goes to position above current
        timeline.push({
            targets: "#" + newNode.nodeTarget,
            top: '37%',
            translateX: (nodes.length - 1) * 100 - 360
        })
        // Current pointer disapears
        timeline.push({
            targets: CURRENT,
            opacity: 0
        })
        // Arrow path appears
        timeline.push({
            targets: "#" + newNode.pathTarget,
            opacity: 1
        })
        // Current arrow goes back to beginning
        timeline.push({
            targets: CURRENT,
            translateX: 0,
            duration: 10
        })

    }

    return timeline

}

// timeline.add({
//     duration: 250,
//     easing: 'easeOutExpo'
// })
// currentTimeline.add({
//     targets: `#node-${input}`,
//     opacity: 1
// })
// currentTimeline.add({
//     targets: "#current",
//     opacity: 1
// })
// nodes.forEach((node, idx) => {
//     currentTimeline.add({
//         targets: "#current",
//         translateX: idx * 100
//     })
// })
// currentTimeline.add({
//     targets: `#node-${input}`,
//     translateX: (nodes.length - 3) * 100 - 40,
//     translateY: 200
// })

// currentTimeline.add({
//     targets: "#current",
//     opacity: 0
// })
// currentTimeline.add({
//     targets: "#current",
//     translateX: 0
// })


// function createDeleteNodeSequence(shiftedNodes, deletedNode, input) {
//     let currentTimeline = anime.timeline({
//         duration: 250,
//         easing: 'easeOutExpo'
//     })
//     currentTimeline.add({
//         targets: "#current",
//         opacity: 1
//     })
//     for (let i = 0; i < input; i++) {
//         currentTimeline.add({
//             targets: "#current",
//             translateX: i * 100
//         })
//     }
//     const current = document.querySelector("#current")
//     const deletedDOM = document.querySelector(`#node-${deletedNode.key}`)
//     currentTimeline.add({
//         targets: [current, deletedDOM],
//         opacity: 0
//     })
//     const elements = shiftedNodes.map(node => {
//         return `#node-${node.key}`
//     })
//     document.querySelectorAll(elements)
//     currentTimeline.add({
//         targets: elements,
//         translateX: '-=100',
//         complete: () => deleteNode(deletedNode)
//     })
//     currentTimeline.add({
//         targets: "#current",
//         translateX: 0
//     })
// }

export default createSequence