import { Runner } from '@svgdotjs/svg.js';
import LinkedListAnimationProducer from './LinkedListAnimationProducer';
import GraphicalLinkedListNode from '../data-structure/GraphicalLinkedListNode';

// Class that produces SVG.Runners animating linked list operations specific to inserting
export default class LinkedListSearchAnimationProducer extends LinkedListAnimationProducer {
  public indicateFound(node: GraphicalLinkedListNode) {
    this.addSequenceAnimation(node.boxTarget.animate().attr({ stroke: '#46B493' }));
    this.addSequenceAnimation(node.numberTarget.animate().attr({ stroke: '#46B493' }));
    this.finishSequence();
    this.resetColor(node);
  }

  public indicateNotFound(node: GraphicalLinkedListNode) {
    this.addSequenceAnimation(node.boxTarget.animate().attr({ stroke: '#FF0000' }));
    this.addSequenceAnimation(node.numberTarget.animate().attr({ stroke: '#FF0000' }));
    this.finishSequence();
    this.resetColor(node);
  }

  private resetColor(node: GraphicalLinkedListNode) {
    this.addSequenceAnimation(node.boxTarget.animate(200).attr({ stroke: '#000000' }));
    this.addSequenceAnimation(node.numberTarget.animate(200).attr({ stroke: '#000000' }));
    this.finishSequence();
  }
}
