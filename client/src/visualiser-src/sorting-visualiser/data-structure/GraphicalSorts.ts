import { SVG } from '@svgdotjs/svg.js';
import AnimationProducer from 'visualiser-src/common/AnimationProducer';
import { Documentation } from 'visualiser-src/common/typedefs';
import GraphicalDataStructure from 'visualiser-src/common/GraphicalDataStructure';
import { injectIds } from 'visualiser-src/common/helpers';
import { CANVAS } from 'visualiser-src/linked-list-visualiser/util/constants';
import GraphicalSortsElement from './GraphicalSortsElement';
import SortsBubbleAnimationProducer from '../animation-producer/SortsBubbleAnimationProducer';
import SortsInsertionAnimationProducer from '../animation-producer/SortsInsertionAnimationProducer';
import SortsCreateAnimationProducer from '../animation-producer/SortsCreateAnimationProducer';

export default class GraphicalSortList extends GraphicalDataStructure {
  public elementList: GraphicalSortsElement[] = [];

  private static documentation: Documentation = injectIds({
    create: {
      args: ['values'],
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

  public create(values: number[]): AnimationProducer {
    SVG(CANVAS).clear();
    const producer = new SortsCreateAnimationProducer();
    this.elementList = values.map((value, idx) => {
      const element = GraphicalSortsElement.from(value);
      producer.addBlock(value, idx, element);
      return element;
    });
    return producer;
  }

  public bubble(): AnimationProducer {
    const producer = new SortsBubbleAnimationProducer();

    const len = this.elementList.length;

    producer.renderBubbleCode();
    let numSwaps = 0;
    for (let i = 0; i < len; i += 1) {
      for (let j = 1; j < len - i; j += 1) {
        producer.doAnimationAndHighlightTimestamp(
          4,
          false,
          producer.compare,
          this.elementList[j - 1],
          this.elementList[j],
          j === len - i - 1
        );
        if (this.elementList[j].data.value < this.elementList[j - 1].data.value) {
          producer.doAnimationAndHighlightTimestamp(
            5,
            false,
            producer.swap,
            this.elementList[j - 1],
            j - 1,
            this.elementList[j],
            j === len - i - 1,
            j
          );
          [this.elementList[j], this.elementList[j - 1]] = [
            this.elementList[j - 1],
            this.elementList[j],
          ];
          numSwaps += 1;
        }
      }
      if (numSwaps === 0) {
        producer.doAnimationAndHighlight(10, producer.finishSequence, false);
        return producer;
      }
      numSwaps = 0;
    }

    return producer;
  }

  insertion(): AnimationProducer {
    const producer = new SortsInsertionAnimationProducer();

    producer.renderInsertionCode();

    const { length } = this.elementList;

    // console.log("before");
    // for (let k = 0; k < length; k += 1) {
    //   console.log(this.elementList[k].data.value);
    // }


    for (let i = 1; i < length; i += 1) {

      // Choosing the first element in our unsorted subarray
      const current = this.elementList[i];
      // The last element of our sorted subarray
      let j = i - 1;
      if (current.data.value >= this.elementList[j].data.value) {
        producer.compare(this.elementList[j], this.elementList[j + 1], i === length - 1);
      }
      while ((j > -1) && (current.data.value < this.elementList[j].data.value)) {
        [this.elementList[j + 1], this.elementList[j]] = [this.elementList[j], this.elementList[j + 1]];

        producer.compare(this.elementList[j], this.elementList[j + 1], j === length - 1);
        producer.swap(this.elementList[j], j + 1, this.elementList[j + 1], true, j);
        j -= 1;
      }
      this.elementList[j + 1] = current;
    }

    // let val;
    // let j = 0;
    // for (let i = 0; i < length; i += 1) {
    //   val = this.elementList[i];
    //   for (j = i; j > 0; j -= 1) {
    //     if (val >= this.elementList[j - 1]) break;
    //     this.elementList[j] = this.elementList[j - 1];
    //   }
    //   this.elementList[j] = val;
    // }


    // console.log("after");
    // for (let k = 0; k < length; k += 1) {
    //   console.log(this.elementList[k].data.value);
    // }
    return producer;
  }

  public get documentation(): Documentation {
    return GraphicalSortList.documentation;
  }
}
