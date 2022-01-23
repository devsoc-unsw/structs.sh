/**
 * Type definitions used by the visualiser
 */

export interface TimelineObject {
  /**
   * CSS selector for the element that is to be animated. This is what animejs uses to select the
   * animation targets
   *  → Eg. '#my-id' will apply the animations to the DOM element with the id 'my-id'
   *  → Docs: https://animejs.com/documentation/#cssSelector
   */
  targets: string | SVGElement | (string | SVGElement)[];

  /**
   * Further CSS properties that Anime will recognise.
   *  → Eg. 'opacity: 1' or 'top: 37%'
   *  → Docs: https://animejs.com/documentation/#cssSelector
   */
  [key: string]: any;
}

export interface AnimationInstruction {
  instructions: TimelineObject;
  offset?: number | string;
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
