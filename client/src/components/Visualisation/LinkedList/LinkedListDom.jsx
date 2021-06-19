import React from 'react';
import anime from 'animejs';
import './style.css';

class LinkedListDom extends React.Component {
    componentDidMount() {
        // a generic queue to be used with different data structures for animations

        class AnimationQueue {
            buffer = [];

            constructor() {}

            pushAnimation(animation) {
                this.buffer.push(animation);
            }

            popAnimation() {
                let animation = this.buffer.shift();

                return animation;
            }

            clearBuffer() {
                this.buffer.splice(0, this.buffer.length);
            }

            getLength() {
                return this.buffer.length;
            }
        }

        // used to store a LUT of the different animation instructions and their properties
        const animationsTable = {
            node_show: {
                opacity: [0, 1],
                duration: 500,
            },
            node_hide: {
                opacity: 0,
                duration: 500,
            },
            node_move_left: {
                translateX: '-=100',
                duration: 500,
            },
            node_highlight: {
                backgroundColor: 'rgb(87, 255, 148)',
                duration: 350,
            },
            node_unhighlight: {
                backgroundColor: 'rgb(48, 48, 48)',
                duration: 350,
            },
        };

        class Node {
            data;
            next;

            constructor(data) {
                this.data = data;
                this.next = null;
            }
        }

        class LinkedList {
            numbers = [];
            length = 0;

            constructor() {
                this.appendNode(1);
                this.appendNode(423);
                this.appendNode(23243);
                this.appendNode(23);
                this.appendNode(22);
                this.appendNode(25);
                this.appendNode(27);
                this.appendNode(2);
            }

            // append a node to the end of the linked list
            appendNode(data) {
                this.numbers.push(data);
                this.length++;
            }

            deleteNode(index) {
                this.numbers.splice(index, 1);
                this.length--;
            }

            printLinkedList() {
                let i;
                for (i = 0; i < this.numbers.length; i++) {
                    console.log(this.numbers[i]);
                }
            }

            getLength() {
                return this.numbers.length;
            }
        }

        const linkedList = new LinkedList();
        const animationQueue = new AnimationQueue();

        function deleteNode() {
            alert(document.getElementById('deleteNodeInput').value);
            const index = linkedList.numbers.indexOf(
                parseInt(document.getElementById('deleteNodeInput').value)
            );

            if (index < 0) {
                // invalid input
                return;
            }

            animationQueue.pushAnimation({ index: index, type: 'node_highlight' });
            animationQueue.pushAnimation({ index: index, type: 'node_hide' });

            for (let i = index + 1; i < linkedList.getLength(); i++) {
                animationQueue.pushAnimation({ index: i, type: 'node_move_left' });
            }

            // create a timeline
            let timeline = anime.timeline({
                complete: function () {
                    // now empty the animation queue and remove the number from the linkedlist
                    // also remove the DOM element
                    animationQueue.clearBuffer();
                    linkedList.deleteNode(index);
                    let elem = document.getElementById(getTarget(index));
                    document.getElementById('linked-list-container').removeChild(elem);
                    remapDOMIDs();
                    document.getElementById('deleteNodeInput').value = '';
                },
            });

            while (animationQueue.getLength() != 0) {
                timeline.add(generateAnimation());
            }
        }

        function appendNode() {
            const data = parseInt(document.getElementById('appendNodeInput').value);
            const index = linkedList.getLength();

            // highlight each node one at a time as we traverse the linked list
            for (let i = 0; i < linkedList.getLength(); i++) {
                animationQueue.pushAnimation({ index: i, type: 'node_highlight' });
                animationQueue.pushAnimation({ index: i, type: 'node_unhighlight' });
            }

            animationQueue.pushAnimation({ index: index, type: 'node_show' });
            animationQueue.pushAnimation({ index: index, type: 'node_highlight' });
            animationQueue.pushAnimation({ index: index, type: 'node_unhighlight' });
            linkedList.appendNode(data);
            renderNode(index);

            // create a timeline
            let timeline = anime.timeline({
                complete: function () {
                    // now empty the animation queue and remove the number from the linkedlist
                    // also remove the DOM element
                    animationQueue.clearBuffer();
                    remapDOMIDs();
                    document.getElementById('appendNodeInput').value = '';
                },
            });

            while (animationQueue.getLength() != 0) {
                timeline.add(generateAnimation());
            }
        }

        function remapDOMIDs() {
            const container = document.getElementById('linked-list-container');
            const nodes = container.getElementsByTagName('div');

            for (let i = 0; i < linkedList.getLength(); i++) {
                nodes[i].id = getTarget(i);
            }
        }

        function animationSequence() {
            // create a timeline
            let timeline = anime.timeline();

            while (animationQueue.getLength() != 0) {
                timeline.add(generateAnimation());
            }
        }

        function getTarget(index) {
            // returns the target (class name) by index
            return 'node-' + index;
        }

        function renderNode(index) {
            const nodeElem = document.createElement('div');
            nodeElem.id = getTarget(index);
            nodeElem.class = getTarget(index);
            nodeElem.style.position = 'absolute';
            nodeElem.style.left = 100 * index + 'px';
            nodeElem.style.top = '50px';

            nodeElem.innerHTML = linkedList.numbers[index];

            document.getElementById('linked-list-container').appendChild(nodeElem);
        }

        function renderInitialLinkedList() {
            for (let i = 0; i < linkedList.numbers.length; i++) {
                renderNode(i);
            }
        }

        function generateAnimation() {
            // returns a json object to be added to the timeline
            const animation = animationQueue.popAnimation();
            const target = '#' + getTarget(animation.index.toString());

            let object = {
                targets: target,
                easing: 'easeInOutSine',
            };

            object = Object.assign(object, animationsTable[animation.type]);

            return object;
        }

        renderInitialLinkedList();

        // Attaching click event handlers
        document.querySelector('#appendNodeButton').addEventListener('click', () => appendNode());
        document.querySelector('#deleteNodeButton').addEventListener('click', () => deleteNode());
    }

    render() {
        return (
            <div>
                <div class="linked-list-container" id="linked-list-container"></div>
                <input id="appendNodeInput" type="text"></input>
                <button id="appendNodeButton" type="button">
                    Append Node
                </button>
                <input id="deleteNodeInput" type="text"></input>
                <button id="deleteNodeButton" type="button">
                    Delete Node
                </button>
            </div>
        );
    }
}

export default LinkedListDom;
