import React from 'react';
import styles from './LinkedList.module.scss';
import Node from './Node';
// import * as d3 from 'd3';
import anime from 'animejs';

// Convert to a functional component
class LinkedList extends React.Component {
    componentDidMount() {
        // dom elements to manipulate
        const pointersGroup = document.querySelector('.visualiser-svg .pointers');
        const nodesGroup = document.querySelector('.visualiser-svg .nodes');
        const [appendButton, deleteButton] = document.querySelectorAll('.visualiser-form button');
        const [appendInput, deleteInput] = document.querySelectorAll('.visualiser-form input');

        // current nodes and pointers
        const nodes = [];
        const pointers = [];

        // currently playing animation
        let animation = null;

        createDefaultList();
        addFormListeners();

        // animation functions
        // drivers for appending and deleting
        function animateAppend(data) {
            appendNodeSVG(appendInput.value, false);
            if (nodes.length > 1) appendPointerSVG(false);
            const animationSequence = generateAppendSequence();
            createAnimation(animationSequence);
        }

        function animateDelete(position) {
            const animationSequence = generateDeleteSequence(position);
            createAnimation(animationSequence);
            nodes.splice(position, 1);
            pointers.splice(0, 1);
        }

        // creates animation instructions for appending
        function generateAppendSequence(data) {
            const pointerSVGs = document.querySelectorAll('.visualiser-svg .pointer');
            const nodeSVGs = document.querySelectorAll('.visualiser-svg .node');
            const animationSequence = [];
            for (let i = 0; i < nodeSVGs.length; i++) {
                // handle node animation
                if (i < nodeSVGs.length - 1) {
                    animationSequence.push({
                        action: 'highlight',
                        targets: [nodeSVGs[i]],
                        // second last node is highlighted for longer
                        duration: i === nodeSVGs.length - 2 ? 2500 : 1000,
                        delay: i === 0 ? 0 : 500,
                    });
                } else {
                    animationSequence.push({
                        action: 'fadeIn',
                        targets: [nodeSVGs[i]],
                        duration: 1000,
                        delay: 500,
                    });
                    if (pointers.length > 0) {
                        animationSequence.push({
                            action: 'appear',
                            targets: [pointerSVGs[i - 1]],
                            duration: 1000,
                            delay: 500,
                        });
                    }
                }

                if (i < pointerSVGs.length - 1) {
                    animationSequence.push({
                        action: 'highlight',
                        targets: [pointerSVGs[i]],
                        duration: 1000,
                        delay: 500,
                    });
                }
            }
            console.log(animationSequence);
            return animationSequence;
        }

        // creates animation instructions for deleting
        function generateDeleteSequence(position) {
            console.log(nodes);
            console.log(pointers);
            const animationSequence = [];
            const pointerSVGs = document.querySelectorAll('.visualiser-svg .pointer');
            const nodeSVGs = document.querySelectorAll('.visualiser-svg .node');
            if (position === 0) {
                // delete first node
                animationSequence.push({
                    action: 'highlight',
                    targets: [nodeSVGs[0]],
                    duration: 1000,
                    delay: 0,
                });
                animationSequence.push({
                    action: 'fadeOut',
                    targets: [nodeSVGs[0]],
                    duration: 1000,
                    delay: 500,
                });
                if (pointers.length > 0) {
                    animationSequence.push({
                        action: 'fadeOut',
                        targets: [pointerSVGs[0]],
                        duration: 1000,
                        delay: 0,
                    });
                }
                // shift items to left
                if (nodes.length > 1) {
                    animationSequence.push({
                        action: 'shiftLeft',
                        targets: [[...nodeSVGs].slice(position + 1)],
                        duration: 1000,
                        delay: 1000,
                    });
                }
                if (pointers.length > 1) {
                    animationSequence.push({
                        action: 'shiftLeft',
                        targets: [[...pointerSVGs].slice(1)],
                        duration: 1000,
                        delay: 0,
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
                    delay: i === 0 ? 0 : 500,
                });
                // only highlight pointers before position to be deleted
                animationSequence.push({
                    action: 'highlight',
                    targets: [pointerSVGs[i]],
                    duration: 1000,
                    delay: 500,
                });
            }
            // highlight node to be deleted
            animationSequence.push({
                action: 'highlight',
                targets: [nodeSVGs[position]],
                duration: 1000,
                delay: 500,
            });

            if (position < nodes.length - 1) {
                // node to be deleted is not the last
                // draw arc to next node
                animationSequence.push({
                    action: 'drawArc',
                    targets: [pointerSVGs[position - 1]],
                    duration: 1000,
                    delay: 500,
                });
                animationSequence.push({
                    action: 'highlight',
                    targets: [pointerSVGs[position]],
                    duration: 500,
                    delay: 0,
                });
            } else {
                // otherwise, pointer will point to null and disappear
                animationSequence.push({
                    action: 'disappear',
                    targets: [pointerSVGs[position - 1]],
                    duration: 1000,
                    delay: 500,
                });
            }
            // make node to be deleted fade out
            animationSequence.push({
                action: 'fadeOut',
                targets: [nodeSVGs[position]],
                duration: 1000,
                delay: 500,
            });
            if (position < nodes.length - 1) {
                // the node to be deleted is not the last
                // fade pointer out in tandem with node
                animationSequence.push({
                    action: 'fadeOut',
                    targets: [pointerSVGs[position]],
                    duration: 1000,
                    delay: 0,
                });
                // flatten arc
                animationSequence.push({
                    action: 'flattenArc',
                    targets: [pointerSVGs[position - 1]],
                    duration: 1000,
                    delay: 500,
                });
                // shorten pointer while shifting everything after deleted node to the left
                animationSequence.push({
                    action: 'shorten',
                    targets: [pointerSVGs[position - 1]],
                    duration: 1000,
                    delay: 1500,
                });
                animationSequence.push({
                    action: 'shiftLeft',
                    targets: [[...pointerSVGs].slice(position + 1)],
                    duration: 1000,
                    delay: 0,
                });
                animationSequence.push({
                    action: 'shiftLeft',
                    targets: [[...nodeSVGs].slice(position + 1)],
                    duration: 1000,
                    delay: 0,
                });
            }
            return animationSequence;
        }

        // generates an animation timeline based on animation instructions
        // stored in global variable
        function createAnimation(animationSequence) {
            let offset = 0;
            animation = anime.timeline();
            animationSequence.forEach((frame, i) => {
                offset += frame.delay;
                switch (frame.action) {
                    case 'highlight':
                        // highlight node without transition
                        animation.add(
                            {
                                targets: frame.targets,
                                fill: [
                                    { value: '#000000', duration: 5 },
                                    { value: '#ff0000', duration: frame.duration - 5 },
                                    { value: '#000000', duration: 0 },
                                ],
                                stroke: [
                                    { value: '#000000', duration: 5 },
                                    { value: '#ff0000', duration: frame.duration - 5 },
                                    { value: '#000000', duration: 0 },
                                ],
                                easing: 'steps(1)',
                            },
                            offset
                        );
                        break;
                    case 'fadeIn':
                        animation.add(
                            {
                                targets: frame.targets,
                                opacity: [
                                    { value: 0, duration: 5 },
                                    { value: 1, duration: frame.duration - 5 },
                                ],
                                easing: 'linear',
                            },
                            offset
                        );
                        break;
                    case 'fadeOut':
                        animation.add(
                            {
                                targets: frame.targets,
                                opacity: [{ value: 0, duration: frame.duration }],
                                easing: 'linear',
                                changeComplete: function () {
                                    // clean up svgs from dom
                                    frame.targets.forEach((el) => el.remove());
                                },
                            },
                            offset
                        );
                        break;
                    case 'appear':
                        // appear on screen without transition
                        animation.add(
                            {
                                targets: frame.targets,
                                opacity: [
                                    { value: 0, duration: 5 },
                                    { value: 1, duration: frame.duration - 5 },
                                ],
                                easing: 'steps(1)',
                            },
                            offset
                        );
                        break;
                    case 'disappear':
                        // disappear from screen without transition
                        animation.add(
                            {
                                targets: frame.targets,
                                opacity: [
                                    { value: 1, duration: 5 },
                                    { value: 0, duration: frame.duration - 5 },
                                ],
                                easing: 'steps(1)',
                                changeComplete: function () {
                                    // clean up svgs from dom
                                    frame.targets.forEach((el) => el.remove());
                                },
                            },
                            offset
                        );
                        break;
                    case 'shiftLeft':
                        // shift all nodes and pointers to the left
                        animation.add(
                            {
                                targets: frame.targets,
                                transform: function (el) {
                                    const currentTransform = getTransformValue(el);
                                    return (
                                        `translate(${currentTransform[0] - getOffsetDistance()}, ` +
                                        `${currentTransform[1]})`
                                    );
                                },
                                easing: 'linear',
                            },
                            offset
                        );
                        break;
                    case 'drawArc':
                        // 'draw' arc by hiding the straight pointer tail and displaying
                        // curved pointer tail
                        // TODO: add a animation that draws the arc, and allows the
                        // tip to follow the path it traces while it's being drawn
                        animation.add(
                            {
                                changeBegin: function () {
                                    convertToArc(frame.targets[0]);
                                },
                            },
                            offset
                        );
                        break;
                    case 'flattenArc':
                        // flatten tail by increasing radius
                        animation.add(
                            {
                                targets: frame.targets[0].childNodes[0],
                                d: [
                                    { value: getArcD(), duration: 5 },
                                    { value: getFlatArcD(), duration: frame.duration - 5 },
                                ],
                                easing: function () {
                                    return function (t) {
                                        // initially slow, then speeds up
                                        return Math.pow(t, 5);
                                    };
                                },
                            },
                            offset
                        );

                        // rotate tip while arc flattens
                        animation.add(
                            {
                                targets: frame.targets[0].childNodes[2],
                                transform: [
                                    { value: getArcTipTransform(), duration: 5 },
                                    {
                                        value: getLongPointerTipTransform(),
                                        duration: frame.duration - 5,
                                    },
                                ],
                                easing: 'linear',
                                changeComplete: function () {
                                    // once animation finishes, the curved tail is hidden and the straight tail
                                    // is displayed
                                    convertToLongPointer(frame.targets[0]);
                                },
                            },
                            offset
                        );
                        break;
                    case 'shorten':
                        // shorten a long pointer
                        animation.add(
                            {
                                targets: frame.targets[0].childNodes[1],
                                x2: [
                                    { value: getLongPointerTailLength(), duration: 5 },
                                    {
                                        value: getShortPointerLength() - getPointerTipHeight(),
                                        duration: frame.duration - 5,
                                    },
                                ],
                                duration: frame.duration,
                                easing: 'linear',
                            },
                            offset
                        );

                        // move pointer while tail shortens
                        animation.add(
                            {
                                targets: frame.targets[0].childNodes[2],
                                duration: frame.duration,
                                transform: [
                                    { value: getLongPointerTipTransform(), duration: 5 },
                                    { value: 'translate(0, 0)', duration: frame.duration - 5 },
                                ],
                                easing: 'linear',
                            },
                            offset
                        );
                        break;
                }
            });
        }

        // svg manipulation functions
        // positions and appends a pointer to the visualiser
        function appendPointerSVG(visible) {
            const newPointer = createPointer();
            const { width, height } = getNodeDimensions();
            newPointer.setAttribute(
                'transform',
                `translate(${(5 / 6) * width + getOffsetDistance() * pointers.length}, ${
                    height / 2 - (1 / 2) * getPointerTipBaseLength() + (1 / 2) * getStrokeWidth()
                })`
            );
            newPointer.setAttribute('opacity', visible ? 1 : 0);
            pointersGroup.appendChild(newPointer);
            pointers.push(1);
        }

        // positions and appends a node to the visualiser
        function appendNodeSVG(data, visible) {
            const newNode = createNode(data);
            newNode.setAttribute(
                'transform',
                `translate(${getOffsetDistance() * nodes.length + getStrokeWidth() / 2}, ${
                    getStrokeWidth() / 2
                })`
            );
            newNode.setAttribute('opacity', visible ? 1 : 0);
            nodesGroup.appendChild(newNode);
            nodes.push(data);
        }

        // creates an SVG node
        //  ________________
        // |          |     |
        // |  <data>  |  .  |
        // |          |     |
        //  ----------------
        function createNode(data) {
            // group for node
            const node = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            // outer rectangle
            const container = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            // separator for data and pointer
            const separator = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            // data value
            const dataText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            // pointer representing null value
            const pointer = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            // key attribute values
            const { height, width } = getNodeDimensions();
            const strokeWidth = getStrokeWidth();
            // style node components
            container.setAttribute('fill', 'transparent');
            container.setAttribute('width', width);
            container.setAttribute('height', height);
            container.setAttribute('stroke-width', strokeWidth);
            container.setAttribute('rx', strokeWidth / 2);
            dataText.setAttribute('x', width / 3);
            dataText.setAttribute('y', height / 2);
            dataText.setAttribute('dominant-baseline', 'middle');
            dataText.setAttribute('text-anchor', 'middle');
            dataText.setAttribute('font-family', 'Georgia');
            dataText.setAttribute('font-size', '1.5rem');
            dataText.textContent = data;
            separator.setAttribute('x1', height);
            separator.setAttribute('x2', height);
            separator.setAttribute('y1', 0);
            separator.setAttribute('y2', height);
            separator.setAttribute('stroke-width', strokeWidth / 2);
            pointer.setAttribute('r', strokeWidth / 2);
            pointer.setAttribute('cx', (5 / 6) * width);
            pointer.setAttribute('cy', height / 2);
            node.setAttribute('fill', 'black');
            node.setAttribute('stroke', 'black');
            // gather together node components
            node.appendChild(container);
            node.appendChild(dataText);
            node.appendChild(separator);
            node.appendChild(pointer);
            node.classList.add('node');
            return node;
        }

        // creates an SVG arrow that points to the left, representing a pointer
        function createPointer() {
            // container group
            const pointer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            // each pointer will have a curved tail and a straight tail, with only one displayed
            // at any given time. the default is the straight tail
            const curvedTail = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const straightTail = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            // pointer tip
            const tip = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            // key attribute values
            const strokeWidth = getStrokeWidth();
            const pointerLength = getShortPointerLength();
            const tipBaseLength = getPointerTipBaseLength();
            const tipHeight = pointerLength / 10;
            const lineLength = pointerLength - tipHeight;
            tip.setAttribute(
                'points',
                `${lineLength}, 0 ${lineLength}, ${tipBaseLength} ${pointerLength}, ${
                    tipBaseLength / 2
                }`
            );
            curvedTail.setAttribute('d', getArcD());
            curvedTail.setAttribute('fill', 'transparent');
            curvedTail.setAttribute('stroke-width', getStrokeWidth());
            curvedTail.setAttribute('opacity', 0);
            straightTail.setAttribute('x1', 0);
            straightTail.setAttribute('x2', lineLength);
            straightTail.setAttribute('y1', tipBaseLength / 2);
            straightTail.setAttribute('y2', tipBaseLength / 2);
            straightTail.setAttribute('fill', 'transparent');
            straightTail.setAttribute('stroke-width', strokeWidth);
            pointer.setAttribute('stroke', 'black');
            pointer.setAttribute('fill', 'black');
            pointer.appendChild(curvedTail);
            pointer.appendChild(straightTail);
            pointer.appendChild(tip);
            pointer.classList.add('pointer');
            return pointer;
        }

        // toggle pointer from straight to curved tail
        function convertToArc(pointer) {
            pointer.childNodes[0].setAttribute('opacity', '1');
            pointer.childNodes[0].setAttribute('d', getArcD());
            pointer.childNodes[1].setAttribute('opacity', '0');
            pointer.childNodes[2].setAttribute('transform', getArcTipTransform());
        }

        // toggle pointer from arc to long tail
        function convertToLongPointer(pointer) {
            pointer.childNodes[1].setAttribute('x2', getLongPointerTailLength());
            pointer.childNodes[1].setAttribute('opacity', 1);
            pointer.childNodes[0].setAttribute('opacity', 0);
            pointer.childNodes[2].setAttribute('transform', getLongPointerTipTransform());
        }

        // svg attribute functions
        // returns d attribute of the first frame of curved tail
        function getArcD() {
            const radius = getNodeDimensions().height * 3;
            return (
                `M ${(1 / 2) * getPointerTipHeight()} ${getPointerTipBaseLength() / 2} ` +
                `a ${radius} ${radius} 0 0 1 ${getLongPointerTailLength()} 0`
            );
        }

        // returns d attribute of the target frame when flattening curved tail
        function getFlatArcD() {
            return (
                `M ${(1 / 2) * getPointerTipHeight()} ${getPointerTipBaseLength() / 2} ` +
                `a 5000 5000 0 0 1 ${getLongPointerTailLength()} 0`
            );
        }

        // returns transform attribute of the tip of a curved pointer
        function getArcTipTransform() {
            return (
                `translate(${getOffsetDistance()}, 0) ` +
                `rotate(35, ${getShortPointerLength()}, ${(1 / 2) * getPointerTipBaseLength()})`
            );
        }

        // returns transform attribute of the tip of a long pointer
        function getLongPointerTipTransform() {
            return (
                `translate(${getOffsetDistance()}, 0) ` +
                `rotate(0, ${getShortPointerLength()}, ${(1 / 2) * getPointerTipBaseLength()})`
            );
        }

        // svg sizing functions
        // returns the dimensions of the node rectangle
        function getNodeDimensions() {
            const height = 2 * parseInt(getComputedStyle(document.documentElement).fontSize);
            const width = (3 / 2) * height;
            return { width, height };
        }

        // returns full horizontal length of a short pointer, including the tip
        function getShortPointerLength() {
            return getNodeDimensions(nodes.length).width;
        }

        // returns total length of a node and pointer pair
        function getOffsetDistance() {
            return (5 / 6) * getNodeDimensions(nodes.length).width + getShortPointerLength();
        }

        // returns thickness of a node's outline and pointer tail
        function getStrokeWidth() {
            return getNodeDimensions().width / 15;
        }

        // returns the length of the base (vertical side) of the pointer's triangular tip
        function getPointerTipBaseLength() {
            return 3 * getStrokeWidth();
        }

        // returns the height of the pointer's triangular tip
        function getPointerTipHeight() {
            return getShortPointerLength() / 10;
        }

        // returns the length of a short pointer's tail
        function getShortPointerTailLength() {
            return getShortPointerLength() - getPointerTipHeight();
        }

        // returns the length of a long pointer's tail
        function getLongPointerTailLength() {
            return getOffsetDistance() + getShortPointerTailLength();
        }

        // miscellaneous utility functions
        // extracts transform values from a transform attribute
        function getTransformValue(target) {
            const transform = target.getAttribute('transform');
            return [...transform.matchAll(/[\d]+\.?(?:[\d]+)?/g)].map((el) => parseFloat(el[0]));
        }

        // disallows non-numeric characters from input
        function handleInput(e) {
            e.target.value = e.target.value.replace(/[\D]+/g, '');
        }

        function addFormListeners() {
            appendInput.addEventListener('input', handleInput);
            deleteInput.addEventListener('input', handleInput);
            appendButton.addEventListener('click', handleAppend);
            deleteButton.addEventListener('click', handleDelete);
        }

        // adds some default values to the linked list
        function createDefaultList() {
            appendPointerSVG(true);
            appendPointerSVG(true);
            appendNodeSVG(2, true);
            appendNodeSVG(4, true);
            appendNodeSVG(3, true);
        }

        function handleAppend(e) {
            e.preventDefault();
            // stop any current animations
            if (animation) {
                animation.seek(999999999999);
                animation = null;
            }
            if (!appendInput.value) {
                return;
            }
            animateAppend(appendInput.value);
            appendInput.value = '';
        }

        function handleDelete(e) {
            e.preventDefault();
            // stop any current animations
            if (animation) {
                animation.seek(999999999999);
                animation = null;
            }
            const position = parseInt(deleteInput.value);
            if (0 <= position && position < nodes.length) {
                animateDelete(position);
            }
            deleteInput.value = '';
        }
    }

    render() {
        return (
            <div className={styles.container}>
                <form className="visualiser-form">
                    <input name="append" placeholder="number to append" />
                    <button name="append">append</button>
                    <input name="delete" placeholder="position to delete" />
                    <button name="delete">delete</button>
                </form>
                <div className="visualiser">
                    <svg className="visualiser-svg" overflow="auto">
                        <g className="nodes" transform="translate(0, 20)"></g>
                        <g className="pointers" transform="translate(0, 20)"></g>
                    </svg>
                </div>
            </div>
        );
    }
}

export default LinkedList;
