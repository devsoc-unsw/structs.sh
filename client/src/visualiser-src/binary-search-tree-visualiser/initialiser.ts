import AnimationController from '../new-controller/genericController';
import { Visualiser } from '../typedefs';
import BST from './data-structure/GraphicalBST';
import { Animation } from './util/typedefs';
import BSTAnimationProducer from './animation-producer/BSTAnimationProducer';

export interface BSTVisualiser extends Visualiser {
    insert: (val: number, updateSlider: (val: number) => void) => void;
    rotateRight: (val: number, updateSlider: (val: number) => void) => void;
}

/**
 * TODO: documentation
 */

/**
 * Structure:
 * . BST class which stores the underlying bst and handles svg manipulation and animation
 * . references to html elements which have event listeners to call methods from the bst class
 */
const initialise = (): any => {
    const bst: BST = new BST();
    const controller: AnimationController = new AnimationController();

    const insert = (val: number, updateSlider: (val: number) => void) => {
        // if a timeline is currently running on the controller then finish it and start the new insert timeline
        controller.finish();

        const animationSequence: BSTAnimationProducer = bst.insert(val);
        console.log(bst.root);
        controller.constructTimeline(animationSequence, updateSlider);
        console.log(bst.root);
    };

    const rotateRight = (val: number, updateSlider: (val: number) => void) => {
        // // if a timeline is currently running on the controller then finish it and start the new insert timeline
        // controller.finish();

        // // this returned timeline value will eventually be used by the animation controller
        // console.log(bst.root);
        // const animationSequence: Animation[] = bst.rotateRight(val);
        // controller.constructTimeline(animationSequence, updateSlider);
    };

    const play = () => {
        controller.play();
    };

    const pause = () => {
        controller.pause();
    };

    // const replay = () => {
    //     controller.seekPercent(0);
    //     controller.play();
    // };

    const setTimeline = (val: number) => {
        // the timeline can only be seeked when it's paused
        controller.pause();
        controller.seekPercent(val);
    };

    const setSpeed = (val: number) => {
        controller.pause();
        controller.setSpeed(val);
        controller.play();
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
