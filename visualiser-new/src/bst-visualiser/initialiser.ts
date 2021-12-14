import { Node } from './typedefs';
import anime from 'animejs';
import BST from './bst';
import { create } from 'domain';
import { Circle, SVG, Text } from '@svgdotjs/svg.js'

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
    let draw = SVG().addTo('body').size(1200, 600)
    const inputValue: HTMLInputElement = document.querySelector('#inputValue');

    const handleInsertClick: EventListener = (e: Event) => {
        e.preventDefault();
        
        const newNode: Node = bst.insert(Number(inputValue.value));

        drawNode(newNode);
    }

    const drawNode = (node: Node): void => {
        if (node.parent != null) {
            node.lineTarget = draw.line(node.parent.x, node.parent.y + 50, node.x, node.y + 50).stroke({ width: 1 });
            node.lineTarget.stroke({ color: '#f06', width: 10, linecap: 'round' });
            node.lineTarget.back();
        }

        // create a g element and add the text and circle elements to it
        node.nodeTarget = draw.group();
        let circle: Circle = draw.circle(50);
        circle.attr({fill: '#f06', cx: node.x, cy: node.y + 50});
        let text: Text = draw.text(node.value.toString());
        text.attr({
            "dominant-baseline": "middle",
            "text-anchor": "middle",
            x: node.x,
            y: node.y + 50
        });
        
        node.nodeTarget.add(circle);
        node.nodeTarget.add(text);
        node.nodeTarget.attr({x: node.x, y: node.y + 50});
    }

    const insertButton = document.querySelector('#insertButton');
    
    insertButton.addEventListener('click', handleInsertClick);
};

export default initialise;
