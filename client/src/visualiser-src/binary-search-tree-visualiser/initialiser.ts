import AnimationController from '../controller/AnimationController';
import { Visualiser } from '../typedefs';
import BST from './data-structure/GraphicalBST';
import BSTAnimationProducer from './animation-producer/BSTAnimationProducer';

export interface BSTVisualiser extends Visualiser {
    insert: (val: number, updateSlider: (val: number) => void) => void;
    rotateLeft: (val: number, updateSlider: (val: number) => void) => void;
    rotateRight: (val: number, updateSlider: (val: number) => void) => void;
}

const initialise = (): any => {
    const bst: BST = new BST();
    const controller: AnimationController = new AnimationController();

    const insert = (val: number, updateSlider: (val: number) => void) => {
        controller.finish();
        const animationSequence: BSTAnimationProducer = bst.insert(val);
        controller.constructTimeline(animationSequence, updateSlider);
    };

    const rotateLeft = (val: number, updateSlider: (val: number) => void) => {
        controller.finish();
        const animationSequence: BSTAnimationProducer = bst.rotateLeft(val);
        controller.constructTimeline(animationSequence, updateSlider);
    };

    const rotateRight = (val: number, updateSlider: (val: number) => void) => {
        controller.finish();
        const animationSequence: BSTAnimationProducer = bst.rotateRight(val);
        controller.constructTimeline(animationSequence, updateSlider);
    };

    const play = () => {
        controller.play();
    };

    const pause = () => {
        controller.pause();
    };

    const setTimeline = (val: number) => {
        controller.seekPercent(val);
    };

    const setSpeed = (val: number) => {
        controller.setSpeed(val);
    };

    const stepBack = () => {
        controller.pause();
        controller.stepBackwards();
    };

    const stepForward = () => {
        controller.pause();
        controller.stepForwards();
    };

    return {
        insert: insert,
        rotateLeft: rotateLeft,
        rotateRight: rotateRight,
        play: play,
        pause: pause,
        setTimeline: setTimeline,
        setSpeed: setSpeed,
        stepBack: stepBack,
        stepForward: stepForward,
    };
};

export default initialise;
