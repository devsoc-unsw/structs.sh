import {
    Animation,
    AppendNodeInput,
    CreateSequenceInput,
    DeleteNodeInput,
    LinkedListOperation,
} from './typedefs';
import {RIGHT_ARROW_PATH, UP_ARROW_PATH, DOWN_RIGHT_ARROW_PATH, UP_RIGHT_ARROW_PATH, BENT_ARROW_PATH} from './svgPaths';

const CURRENT = '#current';
const PREV = '#prev';

const createSequence = (input: CreateSequenceInput, type: LinkedListOperation): Animation[] => {
    if (type === 'append') {
        return createAppendSequence(input as AppendNodeInput);
    } else if (type === 'deleteByIndex') {
        return createDeleteSequence(input as DeleteNodeInput);
    }
}

const createAppendSequence = (input: AppendNodeInput): Animation[] => {
    const timeline: Animation[] = [];
    const { newNode, nodes } = input as AppendNodeInput;

    // newNode appears
    timeline.push({
        targets: newNode.nodeTarget,
        left: (nodes.length - 1) * 100,
        opacity: 1,
        duration: 0,
    })
    // Current pointer appears
    if (nodes.length > 1) {
        timeline.push({
            targets: CURRENT,
            opacity: 1
        })
    }
    // Current pointer moves into position
    for (let i = 0; i < nodes.length - 1; i++) {
        timeline.push({
            targets: CURRENT,
            translateX: i * 100
        })
    }
    // newNode goes to position above current
    // Arrow path appears
    if (nodes.length > 1) {
        timeline.push({
            targets: nodes[nodes.length - 2].pathTarget,
            opacity: 1
        })
    }
    // Current pointer disapears
    timeline.push({
        targets: CURRENT,
        opacity: 0
    })
    // Current arrow goes back to beginning
    timeline.push({
        targets: CURRENT,
        translateX: 0,
        duration: 10
    })
    return timeline;
}

const createDeleteSequence = (input: DeleteNodeInput): Animation[] => {
    const timeline: Animation[] = [];
    const { index, deletedNode, shiftedNodes, prevNode, nodes } = input as DeleteNodeInput;
    // Current and Prev appears
    timeline.push({
        targets: [CURRENT, PREV],
        opacity: 1
    })
    // Curr and Prev loop until it reaches the index
    if (index > 0) {
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
        if (index === nodes.length - 1) {
            timeline.push({
                targets: prevNode.pathTarget,
                opacity: 0
            })
        } else {
            timeline.push({
                targets: prevNode.pathTarget,
                d: [
                    { value: RIGHT_ARROW_PATH },
                    { value: BENT_ARROW_PATH }
                ]
            })
        }
    }

    timeline.push({
        targets: deletedNode.nodeTarget,
        opacity: 0
    })
    // current and prev fades away
    timeline.push({
        targets: [PREV, CURRENT],
        opacity: 0
    })
    if (index > 0) {
        timeline.push({
            targets: prevNode.pathTarget,
            d: [
                { value: BENT_ARROW_PATH },
                { value: RIGHT_ARROW_PATH }
            ],
        })
    }
    timeline.push({
        targets: shiftedNodes.map(n => n.nodeTarget),
        translateX: "-=100",
        // hardcoded offset to make the nodes shift back at the same time as the pointer straightening.
        offset: "-=350"
    })
    // Current and Prev go back to beginning
    timeline.push({
        targets: [CURRENT, PREV],
        translateX: 0
    })
    return timeline;
}
export default createSequence