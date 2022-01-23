import { Runner } from '@svgdotjs/svg.js';
import LinkedListAnimationProducer from './LinkedListAnimationProducer';
import GraphicalLinkedListNode from '../data-structure/GraphicalLinkedListNode';

export default class LinkedListSearchAnimationProducer extends LinkedListAnimationProducer {
  public indicateFound(node: GraphicalLinkedListNode) {
    const runners: Runner[] = [];
    runners.push(node.boxTarget.animate().attr({ stroke: '#46B493' }));
    runners.push(node.numberTarget.animate().attr({ stroke: '#46B493' }));
    this.allRunners.push(runners);
    this.resetColor(node);
  }

  public indicateNotFound(node: GraphicalLinkedListNode) {
    const runners: Runner[] = [];
    runners.push(node.boxTarget.animate().attr({ stroke: '#FF0000' }));
    runners.push(node.numberTarget.animate().attr({ stroke: '#FF0000' }));
    this.allRunners.push(runners);
    this.resetColor(node);
  }

  private resetColor(node: GraphicalLinkedListNode) {
    const runners: Runner[] = [];
    runners.push(node.boxTarget.animate(200).attr({ stroke: '#000000' }));
    runners.push(node.numberTarget.animate(200).attr({ stroke: '#000000' }));
    this.allRunners.push(runners);
  }
}
