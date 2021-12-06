import createNode from './createNode';
import { Animation, Node } from './typedefs';
import anime from 'animejs';
import BST from './bstImpl';
import { create } from 'domain';

/**
 * Initialises the visualiser and binds event handlers to the controller UI.
 */

// basic structure:
// - bstimpl class which handles the underlying bst
// - bstcontroller class which handles animation controls
// event handlers for bst operations which does:
//   - finishes the current timeline
//   - updates the bstimpl class
//   - creates an animation sequence that gets ran by the controller
const initialise = (): void => {
    let bst: BST = new BST();

    // TODO: make it a proper event handler
    const handleInsertClick = (input: number): void => {
        const newNode: Node = createNode(input);

        bst.insert(newNode);

        console.log(bst.root);
        console.log(bst.nodes);
    }

    for (let i = 0; i < 150; i++) {
        handleInsertClick(Math.floor(Math.random() * 100));
    }

    for (let i = 0; i < bst.nodes.length; i++) {
        anime({
            targets: bst.nodes[i].nodeTarget,
            opacity: 1,
            left: bst.nodes[i].x,
            top: bst.nodes[i].y,
            duration: 0,
        });
    }
};

export default initialise;
