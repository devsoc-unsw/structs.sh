import AnimationProducer from '../common/AnimationProducer';
import Controller from '../controller/AnimationController';
import LinkedList from './data-structure/GraphicalLinkedList';
import { defaultSpeed } from './util/constants';

// for documentation read: https://compclub.atlassian.net/wiki/spaces/S/pages/2150892071/Documentation#Visualiser-Docs%3A

const initialiser = (): any => {
  const linkedList: LinkedList = new LinkedList();
  const animationController = new Controller();
  // TODO: Draw head pointer
  animationController.setSpeed(defaultSpeed);

  const appendNode = (val: number, updateSlider: (val: number) => void): void => {
    animationController.finish();

    const producer: AnimationProducer = linkedList.append(val);

    animationController.constructTimeline(producer, updateSlider);
  };

  const deleteNode = (index: number, updateSlider: (val: number) => void): void => {
    animationController.finish();

    const producer: AnimationProducer = linkedList.delete(index);

    animationController.constructTimeline(producer, updateSlider);
  };

  const searchList = (val: number, updateSlider: (val: number) => void): void => {
    animationController.finish();

    const producer: AnimationProducer = linkedList.search(val);

    animationController.constructTimeline(producer, updateSlider);
  };

  const insertNode = (val: number, index: number, updateSlider: (val: number) => void): void => {
    animationController.finish();

    const producer: AnimationProducer = linkedList.insert(val, index);

    animationController.constructTimeline(producer, updateSlider);
  };

  const prependNode = (val: number, updateSlider: (val: number) => void): void => {
    animationController.finish();

    const producer: AnimationProducer = linkedList.prepend(val);

    animationController.constructTimeline(producer, updateSlider);
  };

  const play = () => {
    animationController.play();
  };

  const pause = () => {
    animationController.pause();
  };

  const stepBack = () => {
    animationController.stepBackwards();
  };

  const stepForward = () => {
    animationController.stepForwards();
  };

  const setTimeline = (val: number) => {
    animationController.seekPercent(val);
  };

  const setSpeed = (val: number) => {
    animationController.setSpeed(val);
  };

  return {
    appendNode,
    deleteNode,
    searchList,
    insertNode,
    prependNode,
    play,
    pause,
    stepBack,
    stepForward,
    setTimeline,
    setSpeed,
  };
};

export default initialiser;
