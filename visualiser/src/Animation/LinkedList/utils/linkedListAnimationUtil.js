// creates animation instructions for appending
export function generateAppendSequence(list) {
    const { pointers } = list;
    const pointersGroup = document.querySelectorAll(".visualiser-svg .pointer");
    const nodeSVGs = document.querySelectorAll(".visualiser-svg .node")
    const animationSequence = [];
    for (let i = 0; i < nodeSVGs.length; i++) {
        // handle node animation
        if (i < nodeSVGs.length - 1) {
            animationSequence.push({
                action: 'highlight',
                targets: [nodeSVGs[i]],
                // second last node is highlighted for longer 
                duration: i === nodeSVGs.length - 2 ? 2500 : 1000,
                delay: i === 0 ? 0 : 500
            })
        } else {
            animationSequence.push({
                action: 'fadeIn',
                targets: [nodeSVGs[i]],
                duration: 1000,
                delay: 500
            })
            if (pointers.length > 0) {
                animationSequence.push({
                    action: 'appear',
                    targets: [pointersGroup[i - 1]],
                    duration: 1000,
                    delay: 500
                })
            }
        }

        if (i < pointersGroup.length - 1) {
            animationSequence.push({
                action: 'highlight',
                targets: [pointersGroup[i]],
                duration: 1000,
                delay: 500
            })
        }
    }
    console.log(animationSequence)
    return animationSequence;
}

// creates animation instructions for deleting
export function generateDeleteSequence(list, position) {
    const { nodes, pointers } = list;
    const animationSequence = [];
    const pointersGroup = document.querySelectorAll(".visualiser-svg .pointer");
    const nodeSVGs = document.querySelectorAll(".visualiser-svg .node");
    if (position === 0) {
        // delete first node 
        animationSequence.push({
            action: 'highlight',
            targets: [nodeSVGs[0]],
            duration: 1000,
            delay: 0
        })
        animationSequence.push({
            action: 'fadeOut',
            targets: [nodeSVGs[0]],
            duration: 1000,
            delay: 500
        });
        if (pointers.length > 0) {
            animationSequence.push({
                action: 'fadeOut',
                targets: [pointersGroup[0]],
                duration: 1000,
                delay: 0
            });
        }
        // shift items to left'
        if (nodes.length > 1) {
            animationSequence.push({
                action: 'shiftLeft',
                targets: [[...nodeSVGs].slice(position + 1)],
                duration: 1000,
                delay: 1000
            });
        }
        if (pointers.length > 1) {
            animationSequence.push({
                action: 'shiftLeft',
                targets: [[...pointersGroup].slice(1)],
                duration: 1000,
                delay: 0
            });
        }
        console.log(animationSequence);
        return animationSequence;
    }
    // loop until the position to be deleted is reached
    for (let i = 0; i < position; i++) {
        animationSequence.push({
            action: 'highlight',
            targets: [nodeSVGs[i]],
            duration: 1000,
            delay: i === 0 ? 0 : 500
        })
        // only highlight pointers before position to be deleted
        animationSequence.push({
            action: 'highlight',
            targets: [pointersGroup[i]],
            duration: 1000,
            delay: 500,
        })
    }
    // highlight node to be deleted
    animationSequence.push({
        action: 'highlight',
        targets: [nodeSVGs[position]],
        duration: 1000,
        delay: 500
    });

    if (position < nodes.length - 1) {
        // node to be deleted is not the last
        // draw arc to next node
        animationSequence.push({
            action: 'drawArc',
            targets: [pointersGroup[position - 1]],
            duration: 1000,
            delay: 500,
        })
        animationSequence.push({
            action: 'highlight',
            targets: [pointersGroup[position]],
            duration: 500,
            delay: 0,
        })
    } else {
        // otherwise, pointer will point to null and disappear
        animationSequence.push({
            action: 'disappear',
            targets: [pointersGroup[position - 1]],
            duration: 1000,
            delay: 500,
        })
    }
    // make node to be deleted fade out
    animationSequence.push({
        action: 'fadeOut',
        targets: [nodeSVGs[position]],
        duration: 1000,
        delay: 500
    })
    if (position < nodes.length - 1) {
        // the node to be deleted is not the last
        // fade pointer out in tandem with node
        animationSequence.push({
            action: 'fadeOut',
            targets: [pointersGroup[position]],
            duration: 1000,
            delay: 0
        })
        // flatten arc
        animationSequence.push({
            action: 'flattenArc',
            targets: [pointersGroup[position - 1]],
            duration: 1000,
            delay: 500,
        })
        // shorten pointer while shifting everything after deleted node to the left
        animationSequence.push({
            action: 'shorten',
            targets: [pointersGroup[position - 1]],
            duration: 1000,
            delay: 1500
        })
        animationSequence.push({
            action: 'shiftLeft',
            targets: [[...pointersGroup].slice(position + 1)],
            duration: 1000,
            delay: 0
        })
        animationSequence.push({
            action: 'shiftLeft',
            targets: [[...nodeSVGs].slice(position + 1)],
            duration: 1000,
            delay: 0
        })
    }
    console.log(`Returning: ${animationSequence}`);
    return animationSequence;
}