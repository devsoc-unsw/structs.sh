import { SVG } from '@svgdotjs/svg.js';
import AnimationProducer from 'visualiser-src/common/AnimationProducer';
import { Documentation } from 'visualiser-src/common/typedefs';
import GraphicalDataStructure from 'visualiser-src/common/GraphicalDataStructure';
import { injectIds } from 'visualiser-src/common/helpers';
import { CANVAS } from 'visualiser-src/linked-list-visualiser/util/constants';
import { generateNumbers } from 'visualiser-src/common/RandomNumGenerator';
import GraphicalSortsElement from './GraphicalSortsElement';
import SortsBubbleAnimationProducer from '../animation-producer/SortsBubbleAnimationProducer';
import SortsInsertionAnimationProducer from '../animation-producer/SortsInsertionAnimationProducer';
import SortsCreateAnimationProducer from '../animation-producer/SortsCreateAnimationProducer';

export default class GraphicalSortList extends GraphicalDataStructure {
  public elementList: GraphicalSortsElement[] = [];

  private static documentation: Documentation = injectIds({
    insert: {
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

  public insert(values: number[]): AnimationProducer {
    const producer = new SortsCreateAnimationProducer();
    values.forEach((value) => {
      const element = GraphicalSortsElement.from(value);
      producer.addBlock(value, this.elementList.length, element);
      this.elementList.push(element);
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
          5,
          false,
          producer.compare,
          this.elementList[j - 1],
          this.elementList[j],
          j === len - i - 1
        );
        if (this.elementList[j].data.value < this.elementList[j - 1].data.value) {
          producer.doAnimationAndHighlightTimestamp(
            6,
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
        producer.doAnimationAndHighlight(11, producer.finishSequence, false);
        return producer;
      }
      numSwaps = 0;
    }

    return producer;
  }

  insertion(): AnimationProducer {
    const producer = new SortsInsertionAnimationProducer();

    producer.renderInsertionCode();

    const len = this.elementList.length;
    producer.doAnimationAndHighlightTimestamp(
      4,
      false,
      producer.highlightUnsortedArray,
      this.elementList,
      len
    );

    for (let currIndex = 1; currIndex < len; currIndex += 1) {
      // currIndex is the next unsorted index
      // Choosing the first element in our unsorted subarray
      const current = this.elementList[currIndex];
      // The last element of our sorted subarray
      let srtedEndIdx = currIndex - 1;

      if (current.data.value >= this.elementList[srtedEndIdx].data.value) {
        producer.doAnimationAndHighlightTimestamp(
          8,
          false,
          producer.compare,
          this.elementList[srtedEndIdx],
          this.elementList[srtedEndIdx + 1],
          true
        );
      }

      while ((srtedEndIdx > -1) && (current.data.value < this.elementList[srtedEndIdx].data.value)) {
        producer.doAnimationAndHighlightTimestamp(
          10,
          false,
          producer.compare,
          this.elementList[srtedEndIdx],
          this.elementList[srtedEndIdx + 1],
          ((srtedEndIdx === 0 || current.data.value >= this.elementList[srtedEndIdx - 1].data.value) && currIndex === len - 1)
        );

        producer.doAnimationAndHighlightTimestamp(
          9,
          false,
          producer.swap,
          this.elementList[srtedEndIdx],
          srtedEndIdx, this.elementList[srtedEndIdx + 1],
          (srtedEndIdx === 0 || current.data.value >= this.elementList[srtedEndIdx - 1].data.value)
        );

        [this.elementList[srtedEndIdx + 1], this.elementList[srtedEndIdx]] = [this.elementList[srtedEndIdx], this.elementList[srtedEndIdx + 1]];
        srtedEndIdx -= 1;
      }
    }
    producer.highlightCode(13);
    producer.finishSequence();
    return producer;
  }

  public get documentation(): Documentation {
    return GraphicalSortList.documentation;
  }

  public generate(): void {
    const numbers = generateNumbers();
    this.insert(numbers);
  }
}
