import AnimationProducer from 'visualiser-src/common/AnimationProducer';
import { Documentation } from 'visualiser-src/common/typedefs';
import GraphicalDataStructure from 'visualiser-src/common/GraphicalDataStructure';
import { injectIds } from 'visualiser-src/common/helpers';
import SortsAppendAnimationProducer from '../animation-producer/SortsAppendAnimationProducer';
import SortsAnimationProducer from '../animation-producer/SortsAnimationProducer';
import GraphicalSortsElement from './GraphicalSortsElement';

export default class GraphicalSortList extends GraphicalDataStructure {
  public elementList: GraphicalSortsElement[] = [];

  private static documentation: Documentation = injectIds({
    append: {
      args: ['value'],
      description: 'Add element to list of elements to sort',
    },
    bubble: {
      args: [],
      description: 'Bubble sort',
    },
    insertion: {
      args: [],
      description: 'Insertion Sort'
    }
  });

  append(value: number): AnimationProducer {
    const producer = new SortsAppendAnimationProducer();
    const newElement = GraphicalSortsElement.from(value);

    producer.addElement(value, this.elementList.length, newElement);
    this.elementList.push(newElement);
    return producer;
  }

  // delete(value: number): AnimationProducer {
  //     const producer = new SortsAppendAnimationProducer();

  //     this.valueList()
  //     return producer;
  // }

  bubble(): AnimationProducer {
    const producer = new SortsAnimationProducer();

    const len = this.elementList.length;

    producer.renderBubbleCode();

    for (let i = 0; i < len; i += 1) {
      for (let j = 0; j < len - 1; j += 1) {
        producer.doAnimationAndHighlight(4, producer.highlight, j, j + 1);
        if (this.elementList[j].data.value > this.elementList[j + 1].data.value) {
          producer.doAnimationAndHighlight(
            5,
            producer.swap,
            this.elementList[j],
            j,
            this.elementList[j + 1]
          );
          [this.elementList[j], this.elementList[j + 1]] = [
            this.elementList[j + 1],
            this.elementList[j],
          ];
        }
      }
    }

    return producer;
  }

  insertion(): AnimationProducer {
    const producer = new SortsAnimationProducer();

    const length = this.elementList.length;
    let i, j, val;
    for (let i = 0; i < length; i++) {
      let val = this.elementList[i];
      for (let j = i; j >= 0; j--) {
        if (val < this.elementList[j - 1]) break;
        this.elementList[j] = this.elementList[j - 1];
      }
      this.elementList[j] = val;
    }

    return producer;
  }

  public get documentation(): Documentation {
    return GraphicalSortList.documentation;
  }
}
