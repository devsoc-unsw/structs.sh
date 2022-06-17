import { SVG, Path, Element } from '@svgdotjs/svg.js';
import GraphicalSortsElement from '../data-structure/GraphicalSortsElement';
import SortsAnimationProducer from './SortsAnimationProducer';

export default class SortsAppendAnimationProducer extends SortsAnimationProducer {
    public addElement(value: number, length: number, newBlock: GraphicalSortsElement) {
        this.addBlock(value, length, newBlock);
    }
}