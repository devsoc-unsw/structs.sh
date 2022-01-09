import LinkedListController from '../controller/linkedListController';
import { AnimationInstruction } from './util/typedefs';
import LinkedList from './data-structure/GraphicalLinkedList';
import { defaultSpeed } from './util/constants';

/**
 * TODO:
 */
const initialiser = (): any => {
    const linkedList: LinkedList = new LinkedList();
    const animationController = new LinkedListController();
    animationController.setSpeed(defaultSpeed);

    const appendNode = (val: number, updateSlider: (val: number) => void): void => {
        animationController.finish();

        // Generating the steps of the animation
        const sequence: AnimationInstruction[] = linkedList.append(val);

        // Playing the animation
        animationController.runSequence(sequence, updateSlider);
    };

    const deleteNode = (index: number, updateSlider: (val: number) => void): void => {
        animationController.finish();

        const sequence: AnimationInstruction[] = linkedList.delete(index);

        animationController.runSequence(sequence, updateSlider);
    };

    const searchList = (val: number, updateSlider: (val: number) => void): void => {
        animationController.finish();

        const sequence: AnimationInstruction[] = linkedList.search(val);

        animationController.runSequence(sequence, updateSlider);
    };

    const insertNode = (val: number, index: number, updateSlider: (val: number) => void): void => {
        animationController.finish();

        const sequence: AnimationInstruction[] = linkedList.insert(val, index);

        animationController.runSequence(sequence, updateSlider);
    };

    const play = () => {
        animationController.play();
    };

    const pause = () => {
        animationController.pause();
    };

    const stepBack = () => {
        animationController.gotoPrevious();
    };

    const stepForward = () => {
        animationController.gotoNext();
    };

    const setTimeline = (val: number) => {
        animationController.pause();
        animationController.seekPercent(val);
    };

    const setSpeed = (val: number) => {
        animationController.freeze();
        animationController.setSpeed(val);
    };

    const onFinishSetSpeed = () => {
        if (!animationController.isPaused) play();
    };

    return {
        appendNode: appendNode,
        deleteNode: deleteNode,
        searchList: searchList,
        insertNode: insertNode,
        play: play,
        pause: pause,
        stepBack: stepBack,
        stepForward: stepForward,
        setTimeline: setTimeline,
        setSpeed: setSpeed,
        onFinishSetSpeed: onFinishSetSpeed,
    };
};

export default initialiser;
