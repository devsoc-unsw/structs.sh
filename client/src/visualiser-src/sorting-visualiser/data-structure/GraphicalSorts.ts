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
    append: {
      args: ['values'],
      description: 'Add element to list of elements to sort',
    },
    delete: {
      args: ['values'],
      description: 'Delete elements from list of elements to sort',
    },
    bubble: {
      args: [],
      description: 'Bubble sort',
    },
    insertion: {
      args: [],
      description: 'Insertion Sort'
    },
  });

  public append(values: number[]): AnimationProducer {
    const producer = new SortsCreateAnimationProducer();
    values.forEach((value) => {
      const element = GraphicalSortsElement.from(value);
      producer.addBlock(value, this.elementList.length, element);
      this.elementList.push(element);
    });
    return producer;
  }

  public delete(values: number[]): AnimationProducer {
    const producer = new SortsCreateAnimationProducer();
    const listValues = this.elementList
      .map((element) => element.data.value)
      .filter((x) => !values.includes(x));

    // Clear the canvas, and re-insert the existing values in the list into the canvas
    SVG(CANVAS).clear();
    this.elementList = [];
    this.append(listValues);

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

    let j = 0;
    // Make first node Sorted
    producer.doAnimationAndHighlightTimestamp(
      3,
      false,
      producer.highlightBoxes,
      [this.elementList[0]],
      2
    );

    for (let i = 1; i < len; i += 1) {
      const val = this.elementList[i];
      // Select current
      producer.doAnimationAndHighlightTimestamp(
        4,
        false,
        producer.highlightBoxes,
        [this.elementList[i]],
        3
      );

      for (j = i; j > 0; j -= 1) {
        // Select comparison
        producer.doAnimationAndHighlightTimestamp(
          5,
          false,
          producer.highlightBoxes,
          [this.elementList[j - 1]],
          3
        );
        // DO COMparison
        producer.doAnimationAndHighlightTimestamp(
          6,
          false,
          producer.highlightBoxes,
          [],
          3
        );
        if (val.data.value >= this.elementList[j - 1].data.value) {
          // No swapping needed so turn j green
          producer.doAnimationAndHighlightTimestamp(
            7,
            false,
            producer.highlightBoxes,
            [this.elementList[j - 1]],
            2
          );
          break;
        }
        // swap boxes
        producer.doAnimationAndHighlightTimestamp(
          9,
          false,
          producer.swapi,
          this.elementList[j - 1],
          j - 1, this.elementList[j],
          j,
          !(j > 1)
        );
        [this.elementList[j], this.elementList[j - 1]] = [this.elementList[j - 1], this.elementList[j]];
      }
      producer.doAnimationAndHighlightTimestamp(
        3,
        false,
        producer.highlightBoxes,
        [this.elementList[j]],
        2
      );
    }
    producer.highlightCode(11);
    producer.finishSequence();
    return producer;
  }

  public get documentation(): Documentation {
    return GraphicalSortList.documentation;
  }

  public generate(): void {
    const numbers = generateNumbers();
    this.append(numbers);
  }
}
