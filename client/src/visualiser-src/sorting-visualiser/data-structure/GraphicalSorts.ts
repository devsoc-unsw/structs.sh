import { SVG } from '@svgdotjs/svg.js';
import AnimationProducer from 'visualiser-src/common/AnimationProducer';
import { Documentation } from 'visualiser-src/common/typedefs';
import GraphicalDataStructure from 'visualiser-src/common/GraphicalDataStructure';
import { injectIds } from 'visualiser-src/common/helpers';
import { CANVAS } from 'visualiser-src/linked-list-visualiser/util/constants';
import { generateNumbers } from 'visualiser-src/common/RandomNumGenerator';
import GraphicalSortsElement from './GraphicalSortsElement';
import SortsBubbleAnimationProducer from '../animation-producer/SortsBubbleAnimationProducer';
import SortsMergeAnimationProducer from '../animation-producer/SortsMergeAnimationProducer';
import SortsInsertionAnimationProducer from '../animation-producer/SortsInsertionAnimationProducer';
import SortsCreateAnimationProducer from '../animation-producer/SortsCreateAnimationProducer';
import { sortedColour, checkingColour, defaultColour } from '../util/constants';

export default class GraphicalSortList extends GraphicalDataStructure {
  public elementList: GraphicalSortsElement[] = [];

  private static documentation: Documentation = injectIds({
    append: {
      args: ['values'],
      description: 'Add element to list of elements to sort',
      noTimeline: true,
    },
    delete: {
      args: ['values'],
      description: 'Delete elements from list of elements to sort',
      noTimeline: true,
    },
    bubble: {
      args: [],
      description: 'Bubble ort',
    },
    merge: {
      args: [],
      description: 'Merge Sort',
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

  public merge(): AnimationProducer {
    const producer = new SortsMergeAnimationProducer();

    producer.renderMergeCode();

    const low = 0;
    const high = this.elementList.length - 1;

    const p = 0;

    const tmpList = [...this.elementList];

    this.mergeSort(producer, low, high, low, tmpList);

    return producer;
  }

  public mergeSort(producer: SortsMergeAnimationProducer, low: number, high: number, position: number, tmpList: GraphicalSortsElement[]) {
    if (high <= low) {
      return;
    }

    const mid = Math.floor((low + high) / 2);

    let p = position;

    this.mergeSort(producer, low, mid, low, tmpList);
    this.mergeSort(producer, mid+1, high, mid+1, tmpList);

    let pointerLeft = low;
    let pointerRight = mid + 1;

    producer.doAnimationAndHighlightTimestamp(
      21,
      false,
      producer.highlightSorting,
      low,
      high,
      this.elementList
    );
    
    // compare the value on the pointerLeft and value on the pointerRight
    // move down the column with smaller value
    // and increment the index we are checking by 1
    // do not change the index of column with larger value
    // if either left or right is finished, then move all the other parts down
    // finally move all the columns up

    while (pointerLeft <= mid && pointerRight <= high) {
      // compare this.elemensList[pointerLeft] and this.elementList[pointerRight]
      // move down the column with smaller value

      if (producer.compareLowerandEqual(this.elementList[pointerLeft], this.elementList[pointerRight])) {
        // move down pointerLeft
        producer.doAnimationAndHighlightTimestamp(
          21,
          false,
          producer.moveDown,
          this.elementList[pointerLeft],
          p,
        );
        tmpList[p] = this.elementList[pointerLeft];
        p += 1;
        pointerLeft += 1;
      } else {
        // move down pointerRight
        producer.doAnimationAndHighlightTimestamp(
          24,
          false,
          producer.moveDown,
          this.elementList[pointerRight],
          p,
        );
        tmpList[p] = this.elementList[pointerRight];
        p += 1;
        pointerRight += 1;
      }
    }

    if (pointerLeft === mid + 1) {
      while (pointerRight <= high) {
        // move down this.elementList[pointerRight]
        producer.doAnimationAndHighlightTimestamp(
          15,
          false,
          producer.moveDown,
          this.elementList[pointerRight],
          p,
        );
        tmpList[p] = this.elementList[pointerRight];
        p += 1;
        pointerRight += 1;
      }
    } else {
      while (pointerLeft <= mid) {
        // move down this.elementList[pointerLeft]
        producer.doAnimationAndHighlightTimestamp(
          18,
          false,
          producer.moveDown,
          this.elementList[pointerLeft],
          p,
        );
        tmpList[p] = this.elementList[pointerLeft];
        p += 1;
        pointerLeft += 1;
      }
    }

    for (let i = low; i <= high; i += 1) {
      this.elementList[i] = tmpList[i];
    }

    for (let i = low; i <= high; i += 1) {
      // move up this.elementsList[i]
      producer.doAnimationAndHighlightTimestamp(
        29,
        false,
        producer.moveUp,
        this.elementList[i],
        i
      );
    }
  }

  public insertion(): AnimationProducer {
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
      sortedColour
    );

    for (let i = 1; i < len; i += 1) {
      const val = this.elementList[i];
      // Select current
      producer.doAnimationAndHighlightTimestamp(
        4,
        false,
        producer.highlightBoxes,
        [this.elementList[i]],
        checkingColour
      );

      for (j = i; j > 0; j -= 1) {
        // Select comparison
        producer.doAnimationAndHighlightTimestamp(
          5,
          false,
          producer.highlightBoxes,
          [this.elementList[j - 1]],
          checkingColour
        );
        // Do Comparison
        producer.doAnimationAndHighlightTimestamp(
          6,
          false,
          producer.highlightBoxes,
          [this.elementList[j - 1]],
          checkingColour
        );
        if (val.data.value >= this.elementList[j - 1].data.value) {
          // No swapping needed so turn j green
          producer.doAnimationAndHighlightTimestamp(
            7,
            false,
            producer.highlightBoxes,
            [this.elementList[j - 1]],
            sortedColour
          );
          break;
        }
        // swap boxes
        producer.doAnimationAndHighlightTimestamp(
          8,
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
        sortedColour
      );
    }
    producer.highlightCode(11);
    producer.highlightingBoxes(this.elementList, defaultColour);
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
