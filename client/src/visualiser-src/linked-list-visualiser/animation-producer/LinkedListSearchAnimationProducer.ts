import LinkedListAnimationProducer from './LinkedListAnimationProducer';
import GraphicalLinkedListNode from '../data-structure/GraphicalLinkedListNode';

// Class that produces SVG.Runners animating linked list operations specific to inserting
export default class LinkedListSearchAnimationProducer extends LinkedListAnimationProducer {
  public indicateFound(node: GraphicalLinkedListNode) {
    this.addSequenceAnimation(node.boxTarget.animate().attr({ stroke: '#46B493' }));
    this.addSequenceAnimation(node.numberTarget.animate().attr({ stroke: '#46B493' }));
    this.finishSequence();
  }

  public indicateNotFound(node: GraphicalLinkedListNode) {
    this.addSequenceAnimation(node.boxTarget.animate().attr({ stroke: '#FF0000' }));
    this.addSequenceAnimation(node.numberTarget.animate().attr({ stroke: '#FF0000' }));
    this.finishSequence();
  }

  public resetColor(head: GraphicalLinkedListNode) {
    this.resetPointers();
    let curr = head;
    while (curr != null) {
      this.addSequenceAnimation(curr.boxTarget.animate().attr({ stroke: '#000000' }));
      this.addSequenceAnimation(curr.numberTarget.animate().attr({ stroke: '#000000' }));
      curr = curr.next;
    }
    this.finishSequence();
  }
}
