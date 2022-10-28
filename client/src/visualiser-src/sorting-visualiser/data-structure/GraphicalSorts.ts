import { Svg, SVG } from '@svgdotjs/svg.js';
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
import { greenColour, oragneColour, redColour, defaultColour } from '../util/constants';
import SortsQuickAnimationProducer from '../animation-producer/SortsQuickAnimationProducer';

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
      description: 'Bubble sort',
    },
    insertion: {
      args: [],
      description: 'Insertion Sort'
    },
    quick: {
      args: [],
      description: 'Quick Sort'
    }
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
      greenColour
    );

    for (let i = 1; i < len; i += 1) {
      const val = this.elementList[i];
      // Select current
      producer.doAnimationAndHighlightTimestamp(
        4,
        false,
        producer.highlightBoxes,
        [this.elementList[i]],
        oragneColour
      );

      for (j = i; j > 0; j -= 1) {
        // Select comparison
        producer.doAnimationAndHighlightTimestamp(
          5,
          false,
          producer.highlightBoxes,
          [this.elementList[j - 1]],
          oragneColour
        );
        // Do Comparison
        producer.doAnimationAndHighlightTimestamp(
          6,
          false,
          producer.highlightBoxes,
          [this.elementList[j - 1]],
          oragneColour
        );
        if (val.data.value >= this.elementList[j - 1].data.value) {
          // No swapping needed so turn j green
          producer.doAnimationAndHighlightTimestamp(
            7,
            false,
            producer.highlightBoxes,
            [this.elementList[j - 1]],
            greenColour
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
        greenColour
      );
    }
    producer.highlightCode(11);
    producer.highlightingBoxes(this.elementList, defaultColour);
    producer.finishSequence();
    return producer;
  }

  public quick() {
    const ipointer = GraphicalSortsElement.pointer(0, "#36CBCC");
    const jpointer = GraphicalSortsElement.pointer(0, redColour);

    const producer = new SortsQuickAnimationProducer();
    producer.renderQuickCode();

    const len = this.elementList.length;
    this.quicksort(0, len - 1, producer, ipointer, jpointer);

    producer.hidePointers(<Svg><unknown>ipointer, <Svg><unknown>jpointer);
    producer.makeSolved(this.elementList);

    return producer;
  }

  public quicksort(lo, hi, producer, ipointer, jpointer) {
    if (hi <= lo) {
      producer.doAnimationAndHighlightTimestamp(
        4,
        true,
        producer.highlightPointers,
        ipointer,
        oragneColour,
        jpointer,
        oragneColour
      )
      return;
    }

    // change to move pointers
    producer.doAnimationAndHighlightTimestamp(
      5,
      true,
      producer.initialisePointers,
      ipointer,
      lo,
      "#36CBCC",
      jpointer,
      hi,
      redColour
    )

    const i = this.partition(lo, hi, producer, ipointer, jpointer);
    producer.greyOut(this.elementList, 0, -1);

    producer.greyOut(this.elementList, lo, i - 1);
    producer.doAnimationAndHighlightTimestamp(
      6,
      true,
      producer.initialisePointers,
      ipointer,
      lo,
      "#36CBCC",
      jpointer,
      i - 1,
      redColour
    )

    this.quicksort(lo, i - 1, producer, ipointer, jpointer);
    // todo Combine all animations
    producer.greyOut(this.elementList, i + 1, hi);
    // producer.doAnimationAndHighlightTimestamp(
    //   7,
    //   false,
    //   ,
    //   ipointer,
    //   i + 1,
    //   "#36CBCC",
    //   jpointer,
    //   hi,
    //   redColour,
    //   false
    // )
    producer.initialisePointers(ipointer,
      i + 1,
      "#36CBCC",
      jpointer,
      hi,
      redColour);

    // todo
    producer.doAnimationAndHighlightTimestamp(
      7,
      false,
      producer.highlightBoxes,
      this.elementList.slice(0, i + 1),
      greenColour
    )
    this.quicksort(i + 1, hi, producer, ipointer, jpointer);
  }

  public partition(lo, hi, producer, ipointer, jpointer) {
    const v = this.elementList[lo].data.value;  // pivot
    producer.doAnimationAndHighlightTimestamp( // todo
      11,
      false,
      producer.highlightBoxes,
      [this.elementList[lo]],
      oragneColour
    )

    let i = lo + 1
    // change to move
    producer.doAnimationAndHighlightTimestamp(
      12,
      true,
      producer.initialisePointer,
      ipointer,
      i,
      "#36CBCC"
    )

    let j = hi;
    // producer.doAnimationAndHighlightTimestamp(
    //   12,
    //   false,
    //   producer.initialisePointer,
    //   jpointer,
    //   j,
    //   redColour
    // )

    for (; ;) {
      while (this.elementList[i].data.value <= v && i < j) {
        i += 1;
        producer.doAnimationAndHighlightTimestamp(
          14,
          true,
          producer.movePointer,
          ipointer,
          i
        );
      }
      while (v < this.elementList[j].data.value && j > i) {
        j -= 1;
        producer.doAnimationAndHighlightTimestamp(
          15,
          true,
          producer.movePointer,
          jpointer,
          j
        );
      }

      if (i === j) {
        let end = j;
        if (this.elementList[j].data.value > v) {
          end = j;
        } else {
          end = j + 1;
        }
        // producer.doAnimationAndHighlightTimestamp(
        //   16,
        //   false,
        //   producer.highlightPointer,
        //   jpointer,
        //   redColour
        // )
        producer.highlightingBoxes(this.elementList.slice(lo + 1, end), "#36CBCC");
        producer.doAnimationAndHighlightTimestamp(
          16,
          false,
          producer.highlightingBoxes,
          this.elementList.slice(end, hi + 1),
          redColour
        )
        break;
      }
      producer.doAnimationAndHighlightTimestamp(
        17,
        true,
        producer.swapq,
        this.elementList[i],
        i,
        this.elementList[j],
        j
      );
      [this.elementList[i], this.elementList[j]] = [this.elementList[j], this.elementList[i]];
    }


    // if 
    j = this.elementList[i].data.value < v ? i : i - 1;
    producer.doAnimationAndHighlightTimestamp(
      19,
      true,
      producer.movePointer,
      jpointer,
      j
    )

    // producer.highlightBoxes([this.elementList[lo]], defaultColour);
    producer.doAnimationAndHighlightTimestamp(
      20,
      true,
      producer.swapq,
      this.elementList[lo],
      lo,
      this.elementList[j],
      j
    );
    [this.elementList[lo], this.elementList[j]] = [this.elementList[j], this.elementList[lo]];

    producer.highlightingBoxes(this.elementList.slice(lo, hi + 1), defaultColour);
    // Unhighlight j and i
    producer.doAnimationAndHighlightTimestamp(
      21,
      true,
      producer.highlightPointer,
      jpointer,
      redColour
    );
    return j;
  }

  public get documentation(): Documentation {
    return GraphicalSortList.documentation;
  }

  public generate(): void {
    const numbers = generateNumbers();
    this.append(numbers);
  }
}
