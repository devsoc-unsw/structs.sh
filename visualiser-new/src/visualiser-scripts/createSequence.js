
const CURRENT = "#current"
const PREV = "#prev"
const MORPHED = "M52 48C103.5 15.5 147.5 13.5 198 47.9999M198 47.9999L196.5 28.5M198 47.9999L176.5 48"
const ARROW = "M53 74.6504C75.05 74.6504 76.4 74.6504 98 74.6504M98 74.6504L87.5 64M98 74.6504L87.5 87"

// Node Structure:
// {
//     id: Number,
//     nodeTaget: String,
//     pathTarget: String
// }

function createSequence(input, type) {
    const timeline = []
    if (type === 'append') {
        const { newNode, nodes } = input
        // newNode appears
        timeline.push({
            targets: newNode.nodeTarget,
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
            targets: newNode.nodeTarget,
            top: '37%',
            left: (nodes.length - 1) * 100
        })
        // Current pointer disapears
        timeline.push({
            targets: CURRENT,
            opacity: 0
        })
        // Arrow path appears
        timeline.push({
            targets: newNode.pathTarget,
            opacity: 1
        })
        // Current arrow goes back to beginning
        timeline.push({
            targets: CURRENT,
            translateX: 0,
            duration: 10
        })

    }
    else if (type === 'deleteByIndex') {
        const { index, deletedNode, shiftedNodes, prevNode } = input
        // Current and Prev appears
        timeline.push({
            targets: [CURRENT, PREV],
            opacity: 1
        })
        // Curr and Prev loop until it reaches the index
        if (index !== 0) {
            timeline.push({
                targets: CURRENT,
                translateX: 100
            })
            console.log(index)
            for (let i = 1; i < index; i++) {
                timeline.push({
                    targets: PREV,
                    translateX: '+=100'
                })
                timeline.push({
                    targets: CURRENT,
                    translateX: '+=100'
                })
            }
            // Morph the arrow into bendy arrow
            timeline.push({
                targets: prevNode.pathTarget,
                d: [
                    { value: ARROW },
                    { value: MORPHED }
                ]
            })
        }
        // Vanish the current arrow and the node together
        timeline.push({
            targets: [deletedNode.nodeTarget, CURRENT],
            opacity: 0
        })
        // Arrow should morph back the same time linked list is shifted
        // const playLater = anime({
        //     targets: prevNode.pathTarget,
        //     d: [
        //         {value: MORPHED},
        //         {value: ARROW}
        //     ],
        //     easing: "spring(1, 80, 10, 0)",
        //     autoplay: false
        // })
        timeline.push({
            targets: prevNode.pathTarget,
            d: [
                { value: MORPHED },
                { value: ARROW }
            ],
        })
        timeline.push({
            targets: shiftedNodes.map(n => n.nodeTarget),
            translateX: "-=100",
        })
        // Prev fades away
        timeline.push({
            targets: PREV,
            opacity: 0
        })
        // Current and Prev go back to beginning
        timeline.push({
            targets: [CURRENT, PREV],
            translateX: 0
        })
    }

    return timeline

}

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