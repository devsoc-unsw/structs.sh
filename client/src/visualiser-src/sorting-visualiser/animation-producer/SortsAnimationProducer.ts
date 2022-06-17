import { SVG, Path, Element } from '@svgdotjs/svg.js';
import {topOffset, boxWidth, whitespace} from '../util/constants';
import AnimationProducer from '../../common/AnimationProducer';
import { bubbleCodeSnippet } from '../util/codeSnippets';
import GraphicalSortsElement from '../data-structure/GraphicalSortsElement';

export default class SortsAnimationProducer extends AnimationProducer {

    public addBlock(value: number, length: number, newBlock: GraphicalSortsElement) {
        const rectX = length * (boxWidth + whitespace) + whitespace;
        const rectY = 350 - Math.sqrt(value * 90);
        const textCx = length * (boxWidth + whitespace) + (boxWidth/2 + whitespace);
        const textCy = 360;
          
        newBlock.boxTarget.x(rectX).y(rectY);
        newBlock.numberTarget.cx(textCx).cy(textCy);
        this.addSequenceAnimation(newBlock.boxTarget.animate().attr({ opacity: 1 }));
        this.addSequenceAnimation(newBlock.numberTarget.animate().attr({ opacity: 1 }));
    }

    public swap(from: GraphicalSortsElement, fromIndex: number, to: GraphicalSortsElement) {
        const xFrom = fromIndex * (boxWidth + whitespace) + whitespace;
        const cxFrom = fromIndex * (boxWidth + whitespace) + (boxWidth/2 + whitespace);
        const xTo = (fromIndex + 1) * (boxWidth + whitespace) + whitespace;
        const cxTo = (fromIndex + 1) * (boxWidth + whitespace) + (boxWidth/2 + whitespace);

        //this.addSequenceAnimation(from.boxTarget.animate().attr({fill: "blue"}));
        //this.addSequenceAnimation(to.boxTarget.animate().attr({fill: "blue"}));

        this.addSequenceAnimation(from.boxTarget.animate().x(xTo));
        this.addSequenceAnimation(from.numberTarget.animate().cx(cxTo));
        this.addSequenceAnimation(to.boxTarget.animate().x(xFrom));
        this.addSequenceAnimation(to.numberTarget.animate().cx(cxFrom));


        //this.addSequenceAnimation(from.boxTarget.animate().attr({fill: "white"}));
        //this.addSequenceAnimation(to.boxTarget.animate().attr({fill: "white"}));
        
    }

    public renderBubbleCode() {
        this.renderCode(bubbleCodeSnippet);
    }

    public highlight(i: number, j: number) {

    }
}