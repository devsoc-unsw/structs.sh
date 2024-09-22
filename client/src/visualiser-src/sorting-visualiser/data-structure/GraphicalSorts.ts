import { Polygon, SVG } from '@svgdotjs/svg.js';
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
import SortsQuickAnimationProducer from '../animation-producer/SortsQuickAnimationProducer';
import SortsSelectionAnimationProducer from '../animation-producer/SortsSelectionAnimationProducer';
import {
  sortedColour,
  defaultColour,
  comparingColor,
  selectedColor,
  redColour,
} from '../util/constants';

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
      description: 'Bubble Sort',
    },
    merge: {
      args: [],
      description: 'Merge Sort',
    },
    insertion: {
      args: [],
      description: 'Insertion Sort',
    },
    selection: {
      args: [],
      description: 'Selection sort',
    },
    quick: {
      args: [],
      description: 'Quick Sort',
    },
  });

  public get data(): number[] {
    const data: number[] = [];
    this.elementList.forEach((element) => {
      data.push(element.data.value);
    });
    return data;
  }

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
            producer.bubbleSwap,
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

    const tmpList = [...this.elementList];

    this.mergeSort(producer, 0, this.elementList.length - 1, tmpList);

    return producer;
  }

  public mergeSort(
    producer: SortsMergeAnimationProducer,
    low: number,
    high: number,
    tmpList: GraphicalSortsElement[]
  ) {
    if (high <= low) {
      return;
    }

    const mid = Math.floor((low + high) / 2);

    let p = low;

    this.mergeSort(producer, low, mid, tmpList);
    this.mergeSort(producer, mid + 1, high, tmpList);

    let pointerLeft = low;
    let pointerRight = mid + 1;

    producer.doAnimationAndHighlight(1, producer.highlightSorting, low, high, this.elementList);

    while (pointerLeft <= mid && pointerRight <= high) {
      if (this.elementList[pointerLeft].data.value <= this.elementList[pointerRight].data.value) {
        producer.doAnimationAndHighlight(
          13,
          producer.compareElements,
          this.elementList[pointerLeft],
          this.elementList[pointerRight]
        );

        producer.doAnimationAndHighlight(14, producer.moveDown, this.elementList[pointerLeft], p);
        tmpList[p] = this.elementList[pointerLeft];
        p += 1;
        pointerLeft += 1;
      } else {
        producer.doAnimationAndHighlight(
          15,
          producer.compareElements,
          this.elementList[pointerLeft],
          this.elementList[pointerRight]
        );

        producer.doAnimationAndHighlight(16, producer.moveDown, this.elementList[pointerRight], p);
        tmpList[p] = this.elementList[pointerRight];
        p += 1;
        pointerRight += 1;
      }
    }

    if (pointerLeft === mid + 1) {
      while (pointerRight <= high) {
        producer.doAnimationAndHighlight(20, producer.moveDown, this.elementList[pointerRight], p);
        tmpList[p] = this.elementList[pointerRight];
        p += 1;
        pointerRight += 1;
      }
    } else {
      while (pointerLeft <= mid) {
        producer.doAnimationAndHighlight(19, producer.moveDown, this.elementList[pointerLeft], p);
        tmpList[p] = this.elementList[pointerLeft];
        p += 1;
        pointerLeft += 1;
      }
    }

    for (let i = low; i <= high; i += 1) {
      this.elementList[i] = tmpList[i];
    }

    for (let i = low; i <= high; i += 1) {
      producer.doAnimationAndHighlightTimestamp(24, false, producer.moveUp, this.elementList[i], i);
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
      true,
      producer.highlightBoxes,
      [this.elementList[0]],
      sortedColour
    );

    for (let i = 1; i < len; i += 1) {
      const val = this.elementList[i];
      // Select current
      producer.doAnimationAndHighlightTimestamp(
        4,
        true,
        producer.highlightBoxes,
        [this.elementList[i]],
        comparingColor
      );

      for (j = i; j > 0; j -= 1) {
        // Select comparison
        producer.doAnimationAndHighlightTimestamp(
          5,
          true,
          producer.highlightBoxes,
          [this.elementList[j - 1]],
          comparingColor
        );
        // Do Comparison
        producer.doAnimationAndHighlightTimestamp(
          6,
          true,
          producer.highlightBoxes,
          [this.elementList[j - 1]],
          comparingColor
        );
        if (val.data.value >= this.elementList[j - 1].data.value) {
          // No swapping needed so turn j green
          producer.doAnimationAndHighlightTimestamp(
            7,
            true,
            producer.highlightBoxes,
            [this.elementList[j - 1]],
            sortedColour
          );
          break;
        }
        // swap boxes
        producer.doAnimationAndHighlightTimestamp(
          8,
          true,
          producer.insertionSwap,
          this.elementList[j - 1],
          j - 1,
          this.elementList[j],
          j
        );
        [this.elementList[j], this.elementList[j - 1]] = [
          this.elementList[j - 1],
          this.elementList[j],
        ];
      }

      producer.doAnimationAndHighlightTimestamp(
        3,
        true,
        producer.highlightBoxes,
        [this.elementList[j]],
        sortedColour
      );
    }
    producer.highlightCode(11);
    producer.highlightBoxes(this.elementList, defaultColour);
    producer.finishSequence();
    return producer;
  }

  public quick() {
    const ipointer = GraphicalSortsElement.pointer(0, '#36CBCC');
    const jpointer = GraphicalSortsElement.pointer(0, redColour);

    const producer = new SortsQuickAnimationProducer();
    producer.renderQuickCode();

    const len = this.elementList.length;

    // Start quicksort
    this.quicksort(0, len - 1, producer, ipointer, jpointer);

    // End quicksort
    producer.hidePointers(ipointer, jpointer);
    producer.doAnimationAndHighlight(4, producer.makeSolved, this.elementList);
    return producer;
  }

  public quicksort(
    lo: number,
    hi: number,
    producer: SortsQuickAnimationProducer,
    ipointer: Polygon,
    jpointer: Polygon
  ) {
    // Base Case
    if (hi <= lo) {
      producer.doAnimationAndHighlightTimestamp(
        4,
        true,
        producer.highlightPointers,
        ipointer,
        comparingColor,
        jpointer,
        comparingColor
      );
      return;
    }

    // Start Partition
    producer.doAnimationAndHighlightTimestamp(
      5,
      true,
      producer.initialisePointers,
      ipointer,
      lo,
      '#36CBCC',
      jpointer,
      hi,
      redColour
    );
    const i = this.partition(lo, hi, producer, ipointer, jpointer);

    // producer.greyOut(this.elementList, 0, -1);
    // Focus in on recursed section of array
    producer.greyOut(this.elementList, lo, i - 1);
    producer.doAnimationAndHighlightTimestamp(
      6,
      true,
      producer.initialisePointers,
      ipointer,
      lo,
      '#36CBCC',
      jpointer,
      i - 1,
      redColour
    );
    this.quicksort(lo, i - 1, producer, ipointer, jpointer);

    producer.greyOut(this.elementList, i + 1, hi);
    producer.initialisePointers(ipointer, i + 1, '#36CBCC', jpointer, hi, redColour);
    // Make everything left of recursing array solved
    producer.doAnimationAndHighlightTimestamp(
      7,
      true,
      producer.highlightBoxes,
      this.elementList.slice(0, i + 1),
      sortedColour
    );
    this.quicksort(i + 1, hi, producer, ipointer, jpointer);
  }

  public partition(
    lo: number,
    hi: number,
    producer: SortsQuickAnimationProducer,
    ipointer: Polygon,
    jpointer: Polygon
  ) {
    const v = this.elementList[lo].data.value; // pivot
    // Highligh pivot
    producer.doAnimationAndHighlightTimestamp(
      11,
      true,
      producer.highlightBoxes,
      [this.elementList[lo]],
      comparingColor
    );

    let i = lo + 1;
    // Set i pointer
    producer.doAnimationAndHighlightTimestamp(
      12,
      true,
      producer.initialisePointer,
      ipointer,
      i,
      '#36CBCC'
    );
    let j = hi;

    for (;;) {
      // Shift i pointer
      while (this.elementList[i].data.value <= v && i < j) {
        i += 1;
        producer.doAnimationAndHighlightTimestamp(14, true, producer.movePointer, ipointer, i);
      }
      // Shift j pointer
      while (v < this.elementList[j].data.value && j > i) {
        j -= 1;
        producer.doAnimationAndHighlightTimestamp(15, true, producer.movePointer, jpointer, j);
      }

      if (i === j) {
        // Calculate center of partition
        let end = j;
        if (this.elementList[j].data.value > v) {
          end = j;
        } else {
          end = j + 1;
        }

        // Highlight partition
        producer.highlightBoxes(this.elementList.slice(lo + 1, end), '#36CBCC');
        producer.doAnimationAndHighlightTimestamp(
          16,
          true,
          producer.highlightBoxes,
          this.elementList.slice(end, hi + 1),
          redColour
        );
        break;
      }
      // Swap blocks at i and j
      producer.doAnimationAndHighlightTimestamp(
        17,
        true,
        producer.swap,
        this.elementList[i],
        i,
        this.elementList[j],
        j
      );
      [this.elementList[i], this.elementList[j]] = [this.elementList[j], this.elementList[i]];
    }

    // Swap Pivot with number at the center of partition that is less than it
    j = this.elementList[i].data.value < v ? i : i - 1;
    producer.doAnimationAndHighlightTimestamp(19, true, producer.movePointer, jpointer, j);
    producer.doAnimationAndHighlightTimestamp(
      20,
      true,
      producer.swap,
      this.elementList[lo],
      lo,
      this.elementList[j],
      j
    );
    [this.elementList[lo], this.elementList[j]] = [this.elementList[j], this.elementList[lo]];

    // Unhighlight partition
    producer.doAnimationAndHighlightTimestamp(
      21,
      true,
      producer.highlightBoxes,
      this.elementList.slice(lo, hi + 1),
      defaultColour
    );

    return j;
  }

  public selection(): AnimationProducer {
    const producer = new SortsSelectionAnimationProducer();

    producer.renderSelectionCode();

    // Slowly move boundary between sorted and unsorted partitions of the array
    for (let i = 0; i < this.elementList.length - 1; i += 1) {
      // Select the minimum element in the unsorted partition of the array
      producer.doAnimationAndHighlight(
        3,
        producer.highlightItem,
        this.elementList[i],
        selectedColor
      );
      let minIndex = i;

      for (let j = i + 1; j < this.elementList.length; j += 1) {
        producer.doAnimationAndHighlight(5, producer.check, this.elementList[j]);

        if (this.elementList[j].data.value < this.elementList[minIndex].data.value) {
          producer.doAnimationAndHighlight(
            6,
            producer.select,
            this.elementList[j],
            this.elementList[minIndex]
          );
          minIndex = j;
        } else {
          producer.bufferUnhighlight(this.elementList[j]);
        }
      }

      // Swap the selected minimum element to place it in sorted position
      producer.doAnimationAndHighlight(
        8,
        producer.selectionSwap,
        this.elementList[i],
        i,
        this.elementList[minIndex],
        minIndex
      );
      [this.elementList[i], this.elementList[minIndex]] = [
        this.elementList[minIndex],
        this.elementList[i],
      ];
      producer.doAnimationAndHighlight(
        2,
        producer.finishSelectionRound,
        this.elementList[i],
        this.elementList[minIndex],
        i !== minIndex
      );
    }

    producer.doAnimationAndHighlight(10, producer.highlightAll, this.elementList, sortedColour);
    producer.doAnimation(producer.highlightAll, this.elementList, defaultColour);

    return producer;
  }

  public get documentation(): Documentation {
    return GraphicalSortList.documentation;
  }

  public generate(): void {
    const numbers = generateNumbers();
    this.append(numbers);
  }

  public load(data: number[]): void {
    console.log(data);
    this.append(data);
  }
}
