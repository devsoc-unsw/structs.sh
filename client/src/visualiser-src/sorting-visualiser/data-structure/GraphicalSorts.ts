import AnimationProducer from 'visualiser-src/common/AnimationProducer';
import SortsAnimationProducer from '../animation-producer/SortsAnimationProducer';
import SortsAppendAnimationProducer from '../animation-producer/SortsAppendAnimationProducer';
import { SVG, Path, Container } from '@svgdotjs/svg.js';
import GraphicalDataStructure from 'visualiser-src/common/GraphicalDataStructure';
import { Documentation } from 'visualiser-src/common/typedefs';
import GraphicalSortsElement from './GraphicalSortsElement';

//import { CURRENT, PREV } from '../util/constants';

export default class GraphicalSortList implements GraphicalDataStructure {

    public elementList: GraphicalSortsElement[] = [];
    public valueList: number[] = [];

    private static documentation: Documentation = {
        append: {
            args: ['value'],
            description: "Add element to list of elements to sort"
        },
        // delete: {
        //     args: ['value'],
        //     description: "Remove element from list by value"
        // },
        bubble: {
            args: [],
            description: "Bubble sort"
        }
    }

    append(value: number): AnimationProducer {
        const producer = new SortsAppendAnimationProducer();
        const newElement = GraphicalSortsElement.from(value);
        
        producer.addElement(value, this.elementList.length, newElement);
        this.elementList.push(newElement);
        this.valueList.push(value);
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

        for (let i = 0; i < len; i++) {
            for (let j = 0; j < len - 1; j++) {
                producer.doAnimationAndHighlight(4, producer.highlight, j, j+1);
                if (this.elementList[j].data.value > this.elementList[j + 1].data.value) {
                    producer.doAnimationAndHighlight(5, producer.swap, this.elementList[j], j, this.elementList[j + 1]);
                    [this.elementList[j], this.elementList[j + 1]] = [this.elementList[j + 1], this.elementList[j]];
                }
            }
        }

        return producer;
    }

    public get documentation(): Documentation {
        return GraphicalSortList.documentation;
    }
}