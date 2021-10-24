/**
 * Type definitions used by the visualiser
 */


export interface Node {
    value: number;

    // full DOM element
    nodeTarget: SVGSVGElement;

    // pointer DOM element
    pointerTarget: SVGPathElement;

    // node box and value DOM element
    nodeBoxTarget: SVGGElement;
}

export interface Animation {
    /**
     * CSS selector for the element that is to be animated. This is what animejs uses to select the animation targets
     *  → Eg. '#my-id' will apply the animations to the DOM element with the id 'my-id'
     *  → Docs: https://animejs.com/documentation/#cssSelector
     */
    // targets: string | SVGGElement | SVGSVGElement | SVGPathElement | (string | SVGSVGElement | SVGPathElement)[];
    targets: string | SVGElement | (string | SVGElement)[];

    /**
     * Further CSS properties that Anime will recognise.
     *  → Eg. 'opacity: 1' or 'top: 37%'
     *  → Docs: https://animejs.com/documentation/#cssSelector
     */
    [key: string]: any;
}

/* -------------------------------------------------------------------------- */
/*                               Animation Types                              */
/* -------------------------------------------------------------------------- */

// The types of animations that are supported
export type LinkedListOperation = 'append' | 'deleteByIndex';

// Object containing targets and new node so that a new animation can be constructed
export type CreateSequenceInput = AppendNodeInput | DeleteNodeInput;

export interface AppendNodeInput {
    // The new node to be appended
    newNode: Node;

    // Current nodes in the linked list
    nodes: Node[];
}

export interface DeleteNodeInput {
    // Index of the node to be deleted
    index: number;

    // The list of nodes currently on the DOM
    nodes: Node[];
}
